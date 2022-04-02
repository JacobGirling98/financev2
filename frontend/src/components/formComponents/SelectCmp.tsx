import React from "react";
import Select, { SingleValue } from "react-select";
import { SelectCmpProps } from "../../types/props";
import { SelectOptions } from "../../types/types";

const SelectCmp: React.FC<SelectCmpProps> = props => {

  const options: SelectOptions[] = props.options.map(entry => {
    return { label: entry, value: entry };
  });

  const value: SelectOptions = { label: props.value, value: props.value };

  const className = props.className ? props.className : "form-Select";

  const onChange = (value: SingleValue<SelectOptions>): void => {
    if (
      value &&
      props.index !== undefined &&
      props.field !== undefined &&
      props.nestedOnChange !== undefined
    ) {
      props.nestedOnChange(props.index, props.field, value["value"]);
    } else if (value && props.onChange) {
      props.onChange(value["value"]);
    }
  };

  return (
    <Select
      className={className}
      options={options}
      value={value}
      id={props.id}
      onChange={e => onChange(e)}
    />
  );
};

export default SelectCmp;
