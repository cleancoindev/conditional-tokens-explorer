import { BigNumber } from 'ethers/utils'
import { useEffect, useState } from 'react'

import { useWeb3Connected } from '../contexts/Web3Context'

export const useBalanceForBatchPosition = (positionIds: Array<string>) => {
  const { CTService } = useWeb3Connected()

  const [balances, setBalances] = useState<Array<BigNumber>>([])
  const [error, setError] = useState<Maybe<string>>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)

    const getBalance = async (positionIds: Array<string>) => {
      try {
        const balances = await CTService.balanceOfBatch(positionIds)
        setBalances(balances)
      } catch (err) {
        setError(err)
      }
    }

    getBalance(positionIds)

    setLoading(false)
  }, [CTService, positionIds, setBalances, setError, setLoading])

  return {
    balances,
    error,
    loading,
  }
}