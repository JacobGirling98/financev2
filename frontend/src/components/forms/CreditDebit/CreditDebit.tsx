import React, { useState, useEffect } from "react";
import "../forms.scss";
import CreditDebitRow from "./CreditDebitRow";

const CreditDebit: React.FC = () => {
  // React.FormEvent<HTMLInputElement>

  return (
    <>
      <form className="row g-3">
        <div className="row mb-3">
          <CreditDebitRow />
        </div>
        <div className="row mb-3">
          <CreditDebitRow />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default CreditDebit;
