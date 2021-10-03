import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import CreditDebit from "../../components/forms/CreditDebit/CreditDebit";

import { SelectOptions } from "../../types/types";

import "./NewMoney.scss";

const NewMoney: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>("Credit");

  const options: string[] = [
    "Bank Transfer",
    "Credit",
    "Debit",
    "Personal Transfer",
    "Income",
  ];
  const selectOptions: SelectOptions[] = options.map((entry) => {
    return { label: entry, value: entry };
  });

  const handleChange = (e: SingleValue<SelectOptions>) => {
    if (e) {
      setTransactionType(e["value"]);
    }
  }

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
          <Select
            className="form-Select"
            options={selectOptions}
            id="category"
            onChange={e => handleChange(e)}
          />
        </div>
      </div>

      <CreditDebit />
    </>
  );
};

export default NewMoney;
