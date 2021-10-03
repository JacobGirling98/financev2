import React, { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { SelectOptions } from "../../../types/types";


const CreditDebitRow: React.FC = () => {

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const options: string[] = ["first", "second"];
  const selectOptions: SelectOptions[] = options.map((entry) => {
    return { label: entry, value: entry };
  });

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
          value={date}
          onChange={(e) => setDate(e.currentTarget.value)}
        />
      </div>
      <div className="col-md">
        <label htmlFor="date" className="form-label">
          Category
        </label>
        <Select className="form-Select" options={selectOptions} id="category" />
      </div>
      <div className="col-md">
        <label htmlFor="value" className="form-label">
          Value
        </label>
        <input type="number" className="form-control" id="value" />
      </div>
      <div className="col-md">
        <label htmlFor="quantity" className="form-label">
          Quantity
        </label>
        <input type="number" className="form-control" id="quantity" />
      </div>
      <div className="col-md">
        <label htmlFor="description" className="form-label">
          Category
        </label>
        <CreatableSelect
          className="form-Select"
          options={selectOptions}
          id="description"
        />
      </div>
    </>
  );
};

export default CreditDebitRow;
