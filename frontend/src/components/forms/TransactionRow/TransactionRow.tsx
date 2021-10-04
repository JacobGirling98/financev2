import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { TransactionRowProps } from "../../../types/props";
import { SelectOptions, Transaction } from "../../../types/types";
import SelectCmp from "../../formComponents/SelectCmp";
import "../forms.scss";

const TransactionRow: React.FC<TransactionRowProps> = props => {
  // TODO - extra to select component
  const generateOptions = (options: string[]): SelectOptions[] => {
    let selectOptions: SelectOptions[] = options.map(entry => {
      return { label: entry, value: entry };
    });
    return selectOptions;
  };

  // TODO - static data
  const categories = ["first category", "second category"];
  const recipients = ["first recipient", "second recipient"];
  const accounts = ["first account", "second account"];
  const sources = ["first source", "second source"];
  const descriptions = ["first description", "second description"];

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    props.handleTransactionChange(
      props.index,
      e.currentTarget.id as keyof Transaction,
      e.currentTarget.value
    );
  };

  const handleSelectChange = (
    index: number,
    field: string,
    value: string | boolean | number
  ): void => {
    props.handleTransactionChange(index, field as keyof Transaction, value);
  };

  return (
    <>
      <div className="col-md">
        <label htmlFor="date" className="form-label">
          Date
        </label>
        <input
          type="date"
          className="form-control"
          id="date"
          value={props.transaction.date}
          // onChange={e => setDate(e.currentTarget.value)}
          onChange={e => handleInputChange(e)}
        />
      </div>
      <div className="col-md">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <SelectCmp
          index={props.index}
          field="category"
          options={categories}
          value={props.transaction.category}
          id="category"
          nestedOnChange={handleSelectChange}
        />
      </div>
      <div className="col-md">
        <label htmlFor="value" className="form-label">
          Value
        </label>
        <input type="number" className="form-control" id="value" />
      </div>
      {props.transactionType === "Bank Transfer" ? (
        <div className="col-md">
          <label htmlFor="recipient" className="form-label">
            Recipient
          </label>
          <Select
            className="form-Select"
            options={generateOptions(recipients)}
            id="recipient"
          />
        </div>
      ) : null}
      {props.transactionType === "Personal Transfer" ? (
        <>
          <div className="col-md">
            <label htmlFor="outbound" className="form-label">
              Outbound
            </label>
            <Select
              className="form-Select"
              options={generateOptions(accounts)}
              id="outbound"
            />{" "}
          </div>
          <div className="col-md">
            <label htmlFor="inbound" className="form-label">
              Inbound
            </label>
            <Select
              className="form-Select"
              options={generateOptions(accounts)}
              id="inbound"
            />
          </div>
        </>
      ) : null}
      {props.transactionType === "Income" ? (
        <div className="col-md">
          <label htmlFor="source" className="form-label">
            Source
          </label>
          <Select
            className="form-Select"
            options={generateOptions(sources)}
            id="source"
          />
        </div>
      ) : null}
      {props.transactionType === "Bank Transfer" ||
      props.transactionType === "Credit" ||
      props.transactionType === "Debit" ? (
        <div className="col-md">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input type="number" className="form-control" id="quantity" />
        </div>
      ) : null}

      <div className="col-md">
        <label htmlFor="description" className="form-label">
          Category
        </label>
        <CreatableSelect
          className="form-Select"
          options={generateOptions(descriptions)}
          id="description"
        />
      </div>
    </>
  );
};

export default TransactionRow;
