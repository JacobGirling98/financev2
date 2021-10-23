import React from "react";
import { TransactionRowProps } from "../../../types/props";
import { Transaction } from "../../../types/types";
import SelectCmp from "../../formComponents/SelectCmp";
import "../forms.scss";
import {
  TRANSACTION_FIELDS,
  TRANSACTION_TYPES,
} from "../../../utils/constants";
import CreatableSelectCmp from "../../formComponents/CreatableSelectCmp";
import CurrencyCmp from "../../formComponents/CurrencyCmp";
import { useAppSelector } from "../../../hooks/redux";
import { selectCategories } from "../../../stores/CategoriesSlice";

const TransactionRow: React.FC<TransactionRowProps> = props => {

  const categories = useAppSelector(selectCategories);

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

  const handleValueChange = (value: string) => {
    props.handleTransactionChange(
      props.index,
      "value" as keyof Transaction,
      value
    );
  };

  return (
    <>
      <div className="col-md">
        <label htmlFor={TRANSACTION_FIELDS.date} className="form-label">
          Date
        </label>
        <input
          type="date"
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
        {/* <CurrencyFormat
          className="form-control"
          value={props.transaction.value}
          prefix="£"
          decimalScale={2}
          fixedDecimalScale={true}
          onValueChange={e => handleValueChange(e)}
        /> */}
        <CurrencyCmp
          value={props.transaction.value}
          handleValueChange={handleValueChange}
        />
      </div>
      {props.transactionType === TRANSACTION_TYPES.bankTransfer ? (
        <div className="col-md">
          <label
            htmlFor={TRANSACTION_FIELDS.destination}
            className="form-label"
          >
            Recipient
          </label>
          <SelectCmp
            index={props.index}
            field={TRANSACTION_FIELDS.destination}
            options={props.payees}
            value={props.transaction.destination}
            id={TRANSACTION_FIELDS.destination}
            nestedOnChange={handleSelectChange}
          />
        </div>
      ) : null}
      {props.transactionType === TRANSACTION_TYPES.personalTransfer ? (
        <>
          <div className="col-md">
            <label
              htmlFor={TRANSACTION_FIELDS.outboundAccount}
              className="form-label"
            >
              Outbound
            </label>
            <SelectCmp
              index={props.index}
              field={TRANSACTION_FIELDS.outboundAccount}
              options={props.accounts}
              value={props.transaction.outboundAccount}
              id={TRANSACTION_FIELDS.outboundAccount}
              nestedOnChange={handleSelectChange}
            />
          </div>
          <div className="col-md">
            <label
              htmlFor={TRANSACTION_FIELDS.inboundAccount}
              className="form-label"
            >
              Inbound
            </label>
            <SelectCmp
              index={props.index}
              field={TRANSACTION_FIELDS.inboundAccount}
              options={props.accounts}
              value={props.transaction.inboundAccount}
              id={TRANSACTION_FIELDS.inboundAccount}
              nestedOnChange={handleSelectChange}
            />
          </div>
        </>
      ) : null}
      {props.transactionType === TRANSACTION_TYPES.income ? (
        <div className="col-md">
          <label htmlFor={TRANSACTION_FIELDS.source} className="form-label">
            Source
          </label>
          <SelectCmp
            index={props.index}
            field={TRANSACTION_FIELDS.source}
            options={props.incomeSources}
            value={props.transaction.source}
            id={TRANSACTION_FIELDS.source}
            nestedOnChange={handleSelectChange}
          />
        </div>
      ) : null}
      {props.transactionType === TRANSACTION_TYPES.bankTransfer ||
      props.transactionType === TRANSACTION_TYPES.credit ||
      props.transactionType === TRANSACTION_TYPES.debit ? (
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
          Description
        </label>
        <CreatableSelectCmp
          field="description"
          index={props.index}
          options={props.descriptions}
          id={TRANSACTION_FIELDS.description}
          value={props.transaction.description}
          nestedOnChange={handleSelectChange}
          descriptions={props.descriptions}
          setDescriptions={props.setDescriptions}
        />
      </div>
      <div className="col-md-1">
        <label htmlFor="close" className="form-label"></label>
        <button
          type="button"
          id="close"
          className="form-control btn-close pt-4"
          aria-label="Close"
          disabled={props.removeRowsDisabled}
          onClick={e => props.removeRows(e, props.index)}
        />
      </div>
    </>
  );
};

export default TransactionRow;
