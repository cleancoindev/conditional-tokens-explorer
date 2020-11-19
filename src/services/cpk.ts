import { ethers } from 'ethers'
import { TransactionReceipt } from 'ethers/providers'
import { Moment } from 'moment'

import { CONFIRMATIONS_TO_WAIT } from 'config/constants'
import { NetworkConfig } from 'config/networkConfig'
import CPK from 'contract-proxy-kit/lib/esm'
import EthersAdapter from 'contract-proxy-kit/lib/esm/ethLibAdapters/EthersAdapter'
import { ConditionalTokensService } from 'services/conditionalTokens'
import { RealityService } from 'services/reality'
import { getLogger } from 'util/logger'
import { improveErrorMessage } from 'util/tools'

const logger = getLogger('Services::CPKService')

interface CPKPrepareCustomConditionParams {
  questionId: string
  oracleAddress: string
  outcomesSlotCount: number
  CTService: ConditionalTokensService
}

interface CPKPrepareOmenConditionParams {
  oracleAddress: string
  CTService: ConditionalTokensService
  RtyService: RealityService
  arbitrator: string
  category: string
  outcomes: string[]
  question: string
  openingDateMoment: Moment
  networkConfig: NetworkConfig
}

class CPKService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cpk: any
  provider: ethers.providers.Provider

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(cpk: any, provider: ethers.providers.Provider) {
    this.cpk = cpk
    this.provider = provider
  }

  static async create(
    networkConfig: NetworkConfig,
    provider: ethers.providers.Provider,
    signer?: ethers.Signer
  ) {
    const cpkAddresses = networkConfig.getCPKAddresses()
    const networks = cpkAddresses
      ? {
          [networkConfig.networkId]: cpkAddresses,
        }
      : {}
    const cpk = await CPK.create({
      ethLibAdapter: new EthersAdapter({
        ethers,
        signer,
      }),
      networks,
    })
    return new CPKService(cpk, provider)
  }

  prepareCustomCondition = async (
    prepareCustomConditionParams: CPKPrepareCustomConditionParams
  ): Promise<TransactionReceipt | void> => {
    const { CTService, oracleAddress, outcomesSlotCount, questionId } = prepareCustomConditionParams
    const prepareConditionTx = {
      to: CTService.address,
      data: ConditionalTokensService.encodePrepareCondition(
        questionId,
        oracleAddress,
        outcomesSlotCount
      ),
    }

    const  { hash, transactionResponse } = await this.cpk.execTransactions([prepareConditionTx])
    logger.log(`Transaction hash: ${hash}`)

    return transactionResponse
      .wait(CONFIRMATIONS_TO_WAIT)
      .then((receipt: TransactionReceipt) => {
        logger.log(`Transaction was mined in block`, receipt)
        return receipt
      })
      .catch((error: Error) => {
        logger.error(error)
        throw improveErrorMessage(error)
      })
  }

  prepareOmenCondition = async (
    prepareOmenConditionParams: CPKPrepareOmenConditionParams
  ): Promise<TransactionReceipt | void> => {
    const {
      CTService,
      RtyService,
      arbitrator,
      category,
      networkConfig,
      openingDateMoment,
      oracleAddress,
      outcomes,
      question,
    } = prepareOmenConditionParams

    const realitioAddress = RtyService.address

    // Step 1: Create question in realitio
    const createQuestionTx = {
      to: realitioAddress,
      data: RealityService.encodeAskQuestion(
        question,
        outcomes,
        category,
        arbitrator,
        openingDateMoment,
        networkConfig
      ),
    }

    const questionId = await RtyService.askQuestionConstant({
      arbitratorAddress: arbitrator,
      category,
      openingDateMoment,
      outcomes,
      question,
      networkConfig,
      signerAddress: this.cpk.address,
    })

    // Step 2: Prepare condition
    const prepareConditionTx = {
      to: CTService.address,
      data: ConditionalTokensService.encodePrepareCondition(
        questionId,
        oracleAddress,
        outcomes.length
      ),
    }

    const transactions = [createQuestionTx, prepareConditionTx]

    const { hash, transactionResponse } = await this.cpk.execTransactions(transactions)
    logger.log(`Transaction hash: ${hash}`)

    return transactionResponse
      .wait(CONFIRMATIONS_TO_WAIT)
      .then((receipt: TransactionReceipt) => {
        logger.log(`Transaction was mined in block`, receipt)
        return receipt
      })
      .catch((error: Error) => {
        logger.error(error)
        throw improveErrorMessage(error)
      })
  }

  get address(): string {
    logger.log(`My cpk address is ${this.cpk.address}`)
    return this.cpk.address
  }
}

export { CPKService }
