import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DateRangeSelects from "../../components/forms/DateRangeSelects";
import Summary from "../../components/Summary";

const ViewMoney: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-75">
        <div className="g-3 clearfix d-flex flex-row">
          <div className="d-flex flex-grow-1">
            <h1 className="display-4">View Money</h1>
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center">
            <DateRangeSelects />
          </div>
        </div>
        <Summary />
      </div>
    </>
  );
};

export default ViewMoney;
