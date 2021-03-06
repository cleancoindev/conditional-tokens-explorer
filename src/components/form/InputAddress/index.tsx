import React from 'react'

import { Error, ErrorContainer } from 'components/pureStyledComponents/Error'
import { Textfield } from 'components/pureStyledComponents/Textfield'
import { TitleValue } from 'components/text/TitleValue'
import { isAddress } from 'util/tools'

interface Props {
  address: string
  onAddressChange: (value: string) => void
  onErrorChange: (value: boolean) => void
}

export const InputAddress = ({ address, onAddressChange, onErrorChange }: Props) => {
  const [error, onError] = React.useState('')

  React.useEffect(() => {
    const isNotAValidAddress = !!address && !isAddress(address)
    if (isNotAValidAddress) {
      onError('Invalid address.')
    } else {
      onError('')
    }
    onErrorChange(isNotAValidAddress)
  }, [address, onError, onErrorChange])

  return (
    <>
      <TitleValue
        title={'Send To'}
        value={
          <>
            <Textfield
              error={!!error}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const addressValue = e.target.value
                onAddressChange(addressValue)
              }}
              placeholder={'Address to transfer your outcome tokens...'}
              type="text"
              value={address}
            />

            {!!error && (
              <ErrorContainer>
                <Error>{error}</Error>
              </ErrorContainer>
            )}
          </>
        }
      />
    </>
  )
}
