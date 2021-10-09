import React from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { CreatableSelectCmpProps } from "../../types/props";
import { SelectOptions } from "../../types/types";

const CreatableSelectCmp: React.FC<CreatableSelectCmpProps> = props => {
  const options: SelectOptions[] = props.options.map(entry => {
    return { label: entry, value: entry };
  });

  const value: SelectOptions = { label: props.value, value: props.value };

  const className = props.className ? props.className : "form-Select";

  const onChange = (value: SingleValue<SelectOptions>): void => {
    if (value) {
      props.nestedOnChange(props.index, props.field, value["value"]);
    }
  };

  const onCreateOption = (value: string): void => {
    props.setDescriptions([...props.descriptions, value])
    props.nestedOnChange(props.index, props.field, value);
  }

  return (
    <CreatableSelect
      className={className}
      options={options}
      value={value}
      id={props.id}
      onChange={e => onChange(e)}
      onCreateOption={e => onCreateOption(e)}
    />
  );
};

export default CreatableSelectCmp;
