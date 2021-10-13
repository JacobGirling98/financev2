import React from 'react'
import { CurrencyCmpProps } from '../../types/props'

const CustomCurrencyCmp: React.FC<CurrencyCmpProps> = props => {
  
  const className = props.className ? props.className : "form-control";

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    let value = e.currentTarget.value;
    if (value.split(".").length === 1 || value.split(".")[1].length <= 2) {
      props.handleValueChange(value);
    }
  }

  return (
    <div className="input-group">
      <span className="input-group-text">£</span>
      <input
        id="value"
        className={className}
        type="text"
        value={props.value}
        onChange={e => handleChange(e)}
      />
    </div>

  );
}

export default CustomCurrencyCmp;