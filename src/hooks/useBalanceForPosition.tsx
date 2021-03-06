import { useQuery } from '@apollo/react-hooks'
import { BigNumber } from 'ethers/utils'

import { useWeb3ConnectedOrInfura } from 'contexts/Web3Context'
import { UserPositionBalancesQuery } from 'queries/CTEUsers'
import { UserPositionBalances } from 'types/generatedGQLForCTE'

export const useBalanceForPosition = (positionId: string) => {
  const { cpkAddress } = useWeb3ConnectedOrInfura()

  const { data, error, loading, refetch } = useQuery<UserPositionBalances>(
    UserPositionBalancesQuery,
    {
      skip: !cpkAddress || !positionId,
      variables: {
        account: cpkAddress && cpkAddress.toLowerCase(),
        positionId: positionId,
      },
    }
  )

  const balanceData = {
    balanceERC1155: new BigNumber(0),
    balanceERC20: new BigNumber(0),
    error,
    loading,
    refetch,
  }

  if (data && data?.userPositions.length > 0) {
    const userPosition = data.userPositions[0]
    const { balance: balanceERC1155, wrappedBalance: balanceERC20 } = userPosition
    balanceData.balanceERC1155 = new BigNumber(balanceERC1155)
    balanceData.balanceERC20 = new BigNumber(balanceERC20)
  }

  return balanceData
}
