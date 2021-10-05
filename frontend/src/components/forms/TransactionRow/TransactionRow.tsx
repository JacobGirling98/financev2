import React from "react";
import CreatableSelect from "react-select/creatable";
import { TransactionRowProps } from "../../../types/props";
import { SelectOptions, Transaction } from "../../../types/types";
import SelectCmp from "../../formComponents/SelectCmp";
import "../forms.scss";
import { TRANSACTION_FIELDS } from "../../../utils/constants";

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
        <label htmlFor={TRANSACTION_FIELDS.date} className="form-label">
          Date
        </label>
        <input
          type={TRANSACTION_FIELDS.date}
          className="form-control"
          id={TRANSACTION_FIELDS.date}
          value={props.transaction.date}
          onChange={e => handleInputChange(e)}
        />
      </div>
      <div className="col-md">
        <label htmlFor={TRANSACTION_FIELDS.category} className="form-label">
          Category
        </label>
        <SelectCmp
          index={props.index}
          field={TRANSACTION_FIELDS.category}
          options={categories}
          value={props.transaction.category}
          id={TRANSACTION_FIELDS.category}
          nestedOnChange={handleSelectChange}
        />
      </div>
      <div className="col-md">
        <label htmlFor={TRANSACTION_FIELDS.value} className="form-label">
          Value
        </label>
        <input
          type="number"
          className="form-control"
          id={TRANSACTION_FIELDS.value}
          value={props.transaction.value}
          onChange={e => handleInputChange(e)}
        />
      </div>
      {props.transactionType === "Bank Transfer" ? (
        <div className="col-md">
          <label htmlFor={TRANSACTION_FIELDS.destination} className="form-label">
            Recipient
          </label>
          <SelectCmp
            index={props.index}
            field={TRANSACTION_FIELDS.destination}
            options={recipients}
            value={props.transaction.destination}
            id={TRANSACTION_FIELDS.destination}
            nestedOnChange={handleSelectChange}
          />
        </div>
      ) : null}
      {props.transactionType === "Personal Transfer" ? (
        <>
          <div className="col-md">
            <label htmlFor={TRANSACTION_FIELDS.outboundAccount} className="form-label">
              Outbound
            </label>
            <SelectCmp
              index={props.index}
              field={TRANSACTION_FIELDS.outboundAccount}
              options={accounts}
              value={props.transaction.outboundAccount}
              id={TRANSACTION_FIELDS.outboundAccount}
              nestedOnChange={handleSelectChange}
            />
          </div>
          <div className="col-md">
            <label htmlFor={TRANSACTION_FIELDS.inboundAccount} className="form-label">
              Inbound
            </label>
            <SelectCmp
              index={props.index}
              field={TRANSACTION_FIELDS.inboundAccount}
              options={accounts}
              value={props.transaction.inboundAccount}
              id={TRANSACTION_FIELDS.inboundAccount}
              nestedOnChange={handleSelectChange}
            />
          </div>
        </>
      ) : null}
      {props.transactionType === "Income" ? (
        <div className="col-md">
          <label htmlFor={TRANSACTION_FIELDS.source} className="form-label">
            Source
          </label>
          <SelectCmp
              index={props.index}
              field={TRANSACTION_FIELDS.source}
              options={sources}
              value={props.transaction.source}
              id={TRANSACTION_FIELDS.source}
              nestedOnChange={handleSelectChange}
            />
        </div>
      ) : null}
      {props.transactionType === "Bank Transfer" ||
      props.transactionType === "Credit" ||
      props.transactionType === "Debit" ? (
        <div className="col-md">
          <label htmlFor={TRANSACTION_FIELDS.quantity} className="form-label">
            Quantity
          </label>
          <input 
            type="number" 
            className="form-control" 
            id={TRANSACTION_FIELDS.quantity}
            value={props.transaction.quantity}
            onChange={e => handleInputChange(e)}
          />
        </div>
      ) : null}
      <div className="col-md">
        <label htmlFor={TRANSACTION_FIELDS.description} className="form-label">
          Category
        </label>
        <CreatableSelect
          className="form-Select"
          options={generateOptions(descriptions)}
          id={TRANSACTION_FIELDS.description}
        />
      </div>
    </>
  );
};

export default TransactionRow;
