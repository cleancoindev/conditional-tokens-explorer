import React from 'react'
import styled from 'styled-components'

import { ButtonSelectLight } from 'components/buttons/ButtonSelectLight'
import { DropdownItem, DropdownPosition } from 'components/common/Dropdown'
import { FilterDropdown } from 'components/pureStyledComponents/FilterDropdown'
import {
  FilterTitle,
  FilterTitleButton,
  FilterWrapper,
} from 'components/pureStyledComponents/FilterTitle'
import { WrappedCollateralOptions } from 'util/types'

const Wrapper = styled.div``

interface Props {
  onClear?: () => void
  onClick: (value: WrappedCollateralOptions) => void
  value: string
}

export const WrappedCollateralFilterDropdown: React.FC<Props> = (props) => {
  const { onClear, onClick, value, ...restProps } = props

  const dropdownItems = [
    {
      onClick: () => {
        onClick(WrappedCollateralOptions.All)
      },
      text: 'All',
      value: WrappedCollateralOptions.All,
    },
    {
      onClick: () => {
        onClick(WrappedCollateralOptions.Yes)
      },
      text: 'Yes',
      value: WrappedCollateralOptions.Yes,
    },
    {
      onClick: () => {
        onClick(WrappedCollateralOptions.No)
      },
      text: 'No',
      value: WrappedCollateralOptions.No,
    },
  ]

  return (
    <Wrapper {...restProps}>
      <FilterWrapper>
        <FilterTitle>Wrapped Collateral</FilterTitle>
        {onClear && <FilterTitleButton onClick={onClear}>Clear</FilterTitleButton>}
      </FilterWrapper>
      <FilterDropdown
        currentItem={dropdownItems.findIndex((item) => item.value === value)}
        dropdownButtonContent={
          <ButtonSelectLight
            content={dropdownItems.filter((item) => item.value === value)[0].text}
          />
        }
        dropdownPosition={DropdownPosition.center}
        items={dropdownItems.map((item, index) => (
          <DropdownItem key={index} onClick={item.onClick}>
            {item.text}
          </DropdownItem>
        ))}
      />
    </Wrapper>
  )
}
