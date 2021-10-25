import React from 'react'
import { CurrencyCmpProps } from '../../types/props'

const CurrencyCmp: React.FC<CurrencyCmpProps> = props => {
  
  const className = props.className ? props.className : "form-control";

  const decimalValidator: RegExp = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    let value = e.currentTarget.value;
    if ((value.split(".").length === 1 || value.split(".")[1].length <= 2) && (decimalValidator.test(value) || value === "")) {
      props.handleValueChange(value);
    }
  }

  let value: string = props.value;

  return (
    <div className="input-group">
      <span className="input-group-text">£</span>
      <input
        id="value"
        className={className}
        type="text"
        value={value}
        onChange={e => handleChange(e)}
      />
    </div>

  );
}

export default CurrencyCmp;