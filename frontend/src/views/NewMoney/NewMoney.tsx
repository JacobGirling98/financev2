import React, { useEffect, useState } from "react";
import SelectCmp from "../../components/formComponents/SelectCmp";
import TransactionRow from "../../components/forms/TransactionRow/TransactionRow";

import { Transaction } from "../../types/types";

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

  useEffect(() => {
    console.log("New transactions", transactions);
  }, [transactions]);

  const options: string[] = [
    "Bank Transfer",
    "Credit",
    "Debit",
    "Personal Transfer",
    "Income",
  ];

  const handleTransactionChange = (
    index: number,
    field: keyof Transaction,
    value: string | boolean | number
  ): void => {
    console.log("Parent!");
    let changedTransaction: Transaction[] = transactions;
    (changedTransaction[index] as Record<typeof field, typeof value>)[field] =
      value;
    setTransactions([...changedTransaction]);
  };

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
        {transactions.map((transaction, index) => {
          return (
            <>
              <div className="row mb-3">
                <TransactionRow
                  index={index}
                  transaction={transaction}
                  handleTransactionChange={handleTransactionChange}
                  transactionType={transactionType}
                />
              </div>
            </>
          );
        })}
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
