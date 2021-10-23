/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import SelectCmp from "../../components/formComponents/SelectCmp";
import TransactionRow from "../../components/forms/TransactionRow/TransactionRow";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  GetAllFormOptionsResponse,
  NewMoneyRequest,
  Transaction,
} from "../../types/types";
import { FORM_OPTIONS_URL, NEW_MONEY_URL } from "../../utils/api-urls";

import "./NewMoney.scss";
import { TRANSACTION_TYPES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import UploadReceiptModal from "../../components/formComponents/UploadReceiptModal";
import { useAppSelector } from "../../hooks/redux";

const NewMoney: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>(
    TRANSACTION_TYPES.credit
  );
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      date: new Date().toISOString().split("T")[0],
      outgoing: true,
      value: 0,
      transactionType: "",
      outboundAccount: "",
      inboundAccount: "",
      destination: "",
      source: "",
      description: "",
      category: "",
      quantity: "",
    },
  ]);
  const [receipt, setReceipt] = useState<string>("");

  const [accounts, setAccounts] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [incomeSource, setIncomeSource] = useState<string[]>([]);
  const [payees, setPayees] = useState<string[]>([]);

  const categoriesStatus = useAppSelector(state => state.categories.status);

  const [submitSpinner, setSubmitSpinner] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setFormOptions();
  }, []);

  useEffect(() => {
    resetTransactions();
  }, [transactionType]);

  const transactionTypes: string[] = [
    TRANSACTION_TYPES.bankTransfer,
    TRANSACTION_TYPES.credit,
    TRANSACTION_TYPES.debit,
    TRANSACTION_TYPES.personalTransfer,
    TRANSACTION_TYPES.income,
  ];

  const setFormOptions = async () => {
    const response: GetAllFormOptionsResponse = await axios.get(
      FORM_OPTIONS_URL
    );
    setAccounts(response.data.accounts);
    setDescriptions(response.data.descriptions);
    setIncomeSource(response.data.incomeSource);
    setPayees(response.data.payees);
  };

  const handleTransactionChange = (
    index: number,
    field: keyof Transaction,
    value: string | boolean | number
  ): void => {
    let changedTransaction: Transaction[] = transactions;
    (changedTransaction[index] as Record<typeof field, typeof value>)[field] =
      value;
    setTransactions([...changedTransaction]);
  };

  const resetTransactions = () => {
    setTransactions([
      {
        date: new Date().toISOString().split("T")[0],
        outgoing: true,
        value: 0,
        transactionType: "",
        outboundAccount: "",
        inboundAccount: "",
        destination: "",
        source: "",
        description: "",
        category: "",
        quantity: "",
      },
    ]);
  };

  const addTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
  };

  const addRow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let newTransaction: Transaction = {
      date: new Date().toISOString().split("T")[0],
      outgoing: true,
      value: 0,
      transactionType: "",
      outboundAccount: "",
      inboundAccount: "",
      destination: "",
      source: "",
      description: "",
      category: "",
      quantity: "",
    };
    newTransaction.date = transactions[transactions.length - 1].date;
    newTransaction.destination =
      transactions[transactions.length - 1].destination;
    newTransaction.category = transactions[transactions.length - 1].category;
    setTransactions([...transactions, newTransaction]);
  };

  const clearRows = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resetTransactions();
  };

  const removeRows = (
    event: MouseEvent<HTMLButtonElement>,
    index: number
  ): void => {
    event.preventDefault();
    let newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitSpinner(true);
    let localTransactions = transactions;
    localTransactions.forEach(trans => {
      trans.outgoing = transactionType !== TRANSACTION_TYPES.income;
      trans.transactionType = transactionType;
      if (
        transactionType === TRANSACTION_TYPES.income ||
        transactionType === TRANSACTION_TYPES.personalTransfer
      ) {
        trans.quantity = "1";
      }
    });
    setTransactions(localTransactions);
    console.log({ transactions });
    let res = await axios.post(NEW_MONEY_URL, { transactions });
    console.log(res);
    resetTransactions();
    setSubmitSpinner(false);
  };

  const readyToRender =
    accounts.length &&
    categoriesStatus === "succeeded" &&
    descriptions.length &&
    incomeSource.length &&
    payees.length;

  return (
    <>
      <div className="row px-3">
        <h1 className="display-4 col-md-10">
          New Money -{" "}
          <small className="text-muted fst-italic">{transactionType}</small>
        </h1>
        <div className="col-md-2">
          <label htmlFor="transactionType" className="form-label">
            Transaction Type
          </label>
          <SelectCmp
            className="form-Select"
            options={transactionTypes}
            id="transactionType"
            value={transactionType}
            onChange={e => setTransactionType(e)}
          />
        </div>
      </div>
      <form
        className="row g-3 requires-validation"
        noValidate
        onSubmit={e => handleSubmit(e)}
      >
        {readyToRender ? (
          transactions.map((transaction, index) => {
            return (
              <div className="row mb-3">
                <TransactionRow
                  index={index}
                  transaction={transaction}
                  accounts={accounts}
                  descriptions={descriptions}
                  incomeSources={incomeSource}
                  payees={payees}
                  handleTransactionChange={handleTransactionChange}
                  transactionType={transactionType}
                  setDescriptions={setDescriptions}
                  removeRows={removeRows}
                  removeRowsDisabled={transactions.length === 1}
                />
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
        {submitSpinner && <Spinner />}
        <UploadReceiptModal
          showModal={showModal}
          setShowModal={setShowModal}
          addTransactions={addTransactions}
        />
        <div className="col-12">
          <button type="submit" className="btn btn-outline-success mx-1">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-outline-primary mx-1"
            onClick={e => addRow(e)}
          >
            Add row
          </button>
          <button
            type="button"
            className="btn btn-outline-danger mx-1"
            onClick={e => clearRows(e)}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={e => {
              setShowModal(true);
            }}
          >
            Upload receipt
          </button>
        </div>
      </form>
    </>
  );
};

export default NewMoney;
