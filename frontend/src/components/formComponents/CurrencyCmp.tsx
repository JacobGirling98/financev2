import React from 'react'
import CurrencyFormat from 'react-currency-format'
import { CurrencyCmpProps } from '../../types/props'

const CurrencyCmp: React.FC<CurrencyCmpProps> = (props) => {

  // useEffect(() => {

  // })

  return (
    <CurrencyFormat
          className="form-control"
          value={props.value}
          prefix="£"
          decimalScale={2}
          fixedDecimalScale={true}
          onValueChange={e => props.handleValueChange(e)}
        />
  )


}

export default CurrencyCmp;