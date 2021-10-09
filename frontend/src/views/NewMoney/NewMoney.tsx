import React, { useEffect, useState } from "react";
import SelectCmp from "../../components/formComponents/SelectCmp";
import TransactionRow from "../../components/forms/TransactionRow/TransactionRow";
import axios from "axios";

import { GetAllFormOptionsResponse, Transaction } from "../../types/types";
import { GET_ALL_FORM_OPTIONS } from "../../utils/endpoints";

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
    console.log(descriptions);
  }, [descriptions]);

  useEffect(() => {
    setFormOptions();
  }, [])

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

  const readyToRender = accounts && categories && descriptions && incomeSource && payees;

  return (
    <>
      <div className="row px-3">
        <h1 className="display-4 col-md-10">
          New Money -{" "}
          <small className="text-muted fst-italic">{transactionType}</small>
        </h1>
        <div className="col-md-2">
          <label htmlFor="date" className="form-label">
            Transaction Type
          </label>
          <SelectCmp
            className="form-Select"
            options={options}
            id="category"
            value={transactionType}
            onChange={e => setTransactionType(e)}
          />
        </div>
      </div>
      <form className="row g-3">
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
                />
              </div>
            </>
          );
        }) : null}
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default NewMoney;
