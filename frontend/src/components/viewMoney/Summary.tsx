import React from "react";
import { useQuery } from "react-query";
import { getSummary } from "../../api/ViewMoney";
import { useViewMoneyContext } from "../../context/ViewMoney";
import { ViewMoneySummary } from "../../types/types";
import Spinner from "../Spinner";
import SummaryTile from "./SummaryTile";

const Summary: React.FC = () => {
  const { dateRange } = useViewMoneyContext();

  const startDate = dateRange.start;
  const endDate = dateRange.end;

  const { data, isSuccess } = useQuery<ViewMoneySummary>(
    ["fetchSummary", startDate, endDate],
    () => getSummary(startDate, endDate),
    {
      enabled: !!startDate && !!startDate,
    }
  );

  return (
    <>
      {isSuccess && !!data ? (
        <div className="row g-3">
          <div className="col-md">
            <SummaryTile title="Income" body={data.income} />
          </div>
          <div className="col-md">
            <SummaryTile title="Spending" body={data.spending} />
          </div>
          <div className="col-md">
            <SummaryTile title="Savings" body={data.savings} />
          </div>
          <div className="col-md">
            <SummaryTile title="Net Income" body={data.net} />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Summary;
