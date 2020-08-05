import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { CommonDisabledCSS } from '../../pureStyledComponents/common'
import { ButtonProps } from '../buttonStylingTypes'

import { ChevronDown } from './img/ChevronDown'

const Wrapper = styled.button`
  align-items: center;
  background: #fff;
  border-radius: 50%;
  border: solid 2px ${(props) => props.theme.colors.mediumGrey};
  cursor: pointer;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  line-height: 1.2;
  outline: none;
  padding: 0;
  text-align: center;
  transition: all 0.15s ease-out;
  user-select: none;
  width: 28px;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};

    svg {
      path {
        fill: ${(props) => props.theme.colors.primary};
      }
    }
  }

  .isOpen & {
    border-color: ${(props) => props.theme.colors.primary};
  }

  ${CommonDisabledCSS}
`

export const ButtonDropdownCircle: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props: ButtonProps
) => {
  const { ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <ChevronDown />
    </Wrapper>
  )
}
