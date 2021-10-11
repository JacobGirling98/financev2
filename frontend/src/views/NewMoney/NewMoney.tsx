/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import SelectCmp from "../../components/formComponents/SelectCmp";
import TransactionRow from "../../components/forms/TransactionRow/TransactionRow";
import axios from "axios";

import { GetAllFormOptionsResponse, NewMoneyRequest, Transaction } from "../../types/types";
import { GET_ALL_FORM_OPTIONS, SUBMIT_NEW_MONEY } from "../../utils/endpoints";

import "./NewMoney.scss";


const NewMoney: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>("Credit");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      date: new Date().toISOString().split("T")[0],
      outgoing: true,
      value: undefined,
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
  const [accounts, setAccounts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [incomeSource, setIncomeSource] = useState<string[]>([]);
  const [payees, setPayees] = useState<string[]>([]);

  useEffect(() => {
    setFormOptions();
  }, []);

  useEffect(() => {
    resetTransactions();
  }, [transactionType]);

  const options: string[] = [
    "Bank Transfer",
    "Credit",
    "Debit",
    "Personal Transfer",
    "Income",
  ];

  const setFormOptions = async () => {
    const response: GetAllFormOptionsResponse = await axios(GET_ALL_FORM_OPTIONS);
    setAccounts(response.data.accounts);
    setCategories(response.data.categories);
    setDescriptions(response.data.descriptions);
    setIncomeSource(response.data.incomeSource);
    setPayees(response.data.payees);
  }

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
    setTransactions([{
      date: new Date().toISOString().split("T")[0],
      outgoing: true,
      value: undefined,
      transactionType: "",
      outboundAccount: "",
      inboundAccount: "",
      destination: "",
      source: "",
      description: "",
      category: "",
      quantity: "",
    }])
  }

  const addRow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let newTransaction: Transaction = {
      date: new Date().toISOString().split("T")[0],
      outgoing: true,
      value: undefined,
      transactionType: "",
      outboundAccount: "",
      inboundAccount: "",
      destination: "",
      source: "",
      description: "",
      category: "",
      quantity: "",
    }
    newTransaction.date = transactions[transactions.length - 1].date;
    newTransaction.destination = transactions[transactions.length - 1].destination;
    newTransaction.category = transactions[transactions.length - 1].category;
    setTransactions([...transactions, newTransaction]);
  }

  const clearRows = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resetTransactions();
  }

  const removeRows = (event: MouseEvent<HTMLButtonElement>, index: number): void => {
    event.preventDefault();
    let newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log("Submit");
    event.preventDefault();
    event.currentTarget.className += " was-validated";

    const request: NewMoneyRequest = {
      method: "post",
      url: SUBMIT_NEW_MONEY,
      headers: { "content-type": "application/json" },
      data: { transactions },
    };

    // let res = await axios(request);

  }

  const readyToRender = accounts && categories && descriptions && incomeSource && payees;

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
            options={options}
            id="transactionType"
            value={transactionType}
            onChange={e => setTransactionType(e)}
          />
        </div>
      </div>
      <form className="row g-3 requires-validation" noValidate onSubmit={e => handleSubmit(e)}>
        {readyToRender ? transactions.map((transaction, index) => {
          return (
            <>
              <div className="row mb-3">
                <TransactionRow
                  index={index}
                  transaction={transaction}
                  accounts={accounts}
                  categories={categories}
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
            </>
          );
        }) : null}
        <div className="col-12">
          <button type="submit" className="btn btn-outline-success mx-1">
            Submit
          </button>
          <button type="button" className="btn btn-outline-primary mx-1" onClick={e => addRow(e)}>
            Add row
          </button>
          <button type="button" className="btn btn-outline-danger mx-1" onClick={e => clearRows(e)}>
            Clear
          </button>
        </div>
      </form>
    </>
  );
};

export default NewMoney;
