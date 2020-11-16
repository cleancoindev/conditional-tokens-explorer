import moment from 'moment'
import React, { useRef } from 'react'
import styled from 'styled-components'

import { ButtonFilterSubmit } from 'components/buttons/ButtonFilterSubmit'
import { ErrorContainer, Error as ErrorMessage } from 'components/pureStyledComponents/Error'
import {
  FilterTitle,
  FilterTitleButton,
  FilterWrapper,
} from 'components/pureStyledComponents/FilterTitle'
import { Textfield } from 'components/pureStyledComponents/Textfield'
import { MAX_DATE, MIN_DATE } from 'config/constants'

const Wrapper = styled.div``

const Rows = styled.div``

const Row = styled.div`
  align-items: flex-end;
  column-gap: 8px;
  display: grid;
  grid-template-columns: 1fr 32px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.label`
  color: ${(props) => props.theme.colors.textColor};
  display: block;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 3px;
`

const FieldWrapper = styled.div`
  min-width: 0;
`

const Date = styled(Textfield)`
  font-size: 14px;
  height: 32px;
  padding-left: 6px;
  padding-right: 6px;
  position: relative;
`

interface Props {
  onChangeFrom?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeTo?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  onSubmit: (from: Maybe<number>, to: Maybe<number>) => void
  title: string
}

export const DateFilter: React.FC<Props> = (props) => {
  const { onChangeFrom, onChangeTo, onClear, onSubmit, title, ...restProps } = props
  const toDate = useRef<HTMLInputElement>(null)
  const fromDate = useRef<HTMLInputElement>(null)

  const [from, setFrom] = React.useState<Maybe<number>>(null)
  const [to, setTo] = React.useState<Maybe<number>>(null)

  const onChangeFromInternal = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChangeFrom === 'function') {
        onChangeFrom(event)
      }

      const currentMinDate = moment(event.currentTarget.value).utc().startOf('day').unix()
      const minDate = moment(MIN_DATE).utc().startOf('day').unix()

      const fromTimestamp = currentMinDate < minDate ? minDate : currentMinDate

      setFrom(fromTimestamp)
    },
    [onChangeFrom]
  )

  const onChangeToInternal = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChangeTo === 'function') {
        onChangeTo(event)
      }

      const currentMaxDate = moment(event.currentTarget.value).utc().endOf('day').unix()
      const maxDate = moment(MAX_DATE).utc().endOf('day').unix()

      const toTimestamp = currentMaxDate > maxDate ? maxDate : currentMaxDate

      setTo(toTimestamp)
    },
    [onChangeTo]
  )

  const emptyValues = !from && !to
  const fromGreaterThanToError = (to && from && to < from) || false
  const submitDisabled = !!fromGreaterThanToError || emptyValues

  const onSubmitInternal = React.useCallback(() => {
    if ((from || to) && !submitDisabled) {
      onSubmit(from, to)
    }
  }, [from, to, onSubmit, submitDisabled])

  const onPressEnter = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmitInternal()
      }
    },
    [onSubmitInternal]
  )

  React.useEffect(() => {
    if (!from && !to) onSubmit(from, to)
  }, [from, to, onSubmit])

  return (
    <Wrapper {...restProps}>
      <FilterWrapper>
        <FilterTitle>{title}</FilterTitle>
        {onClear && (
          <FilterTitleButton disabled={emptyValues} onClick={onClear}>
            Clear
          </FilterTitleButton>
        )}
      </FilterWrapper>
      <Rows className="dateFilterRows">
        <Row className="dateFilterRow">
          <FieldWrapper>
            <Label>From:</Label>
            <Date
              max={MAX_DATE}
              min={MIN_DATE}
              name="dateFrom"
              onChange={onChangeFromInternal}
              onKeyUp={onPressEnter}
              ref={fromDate}
              type="date"
            />
          </FieldWrapper>
        </Row>
        <Row className="dateFilterRow">
          <FieldWrapper>
            <Label>To:</Label>
            <Date
              max={MAX_DATE}
              min={MIN_DATE}
              name="dateTo"
              onChange={onChangeToInternal}
              onKeyUp={onPressEnter}
              ref={toDate}
              type="date"
            />
          </FieldWrapper>
          <ButtonFilterSubmit disabled={submitDisabled} onClick={onSubmitInternal} />
        </Row>
      </Rows>
      {fromGreaterThanToError && (
        <ErrorContainer>
          {fromGreaterThanToError && (
            <ErrorMessage>
              <i>To</i> must be greater than <i>From</i>
            </ErrorMessage>
          )}
        </ErrorContainer>
      )}
    </Wrapper>
  )
}
