import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DateRangeSelects from "../../components/forms/DateRangeSelects";
import Summary from "../../components/viewMoney/Summary";
import Table from "../../components/viewMoney/Table";

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
        <div className="my-4">
          <Summary />
        </div>
        <hr />
        {/* <div className="my-4">
          <Table 
            title="Transactions"
          />
        </div> */}
      </div>
    </>
  );
};

export default ViewMoney;
