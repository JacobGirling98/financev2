import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchSummaryByDate, viewMoneyDateRange, viewMoneySummary } from '../../stores/ViewMoneySlice';
import Spinner from '../Spinner';
import SummaryTile from './SummaryTile';

const Summary: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(viewMoneyDateRange);
  const summary = useAppSelector(viewMoneySummary);

  useEffect(() => {
    const formatDateRequestParam = (date: Date): string => {
      const split: string[] = date.toString().split(" ");
      return `${split[3]}-${monthToNumber(split[2])}-${split[1]}`
    }

    if (dateRange) {
      const start = formatDateRequestParam(dateRange.start)
      const end = formatDateRequestParam(dateRange.end)
      dispatch(fetchSummaryByDate({ start, end }))
    }
  }, [dispatch, dateRange])

  const monthToNumber = (month: string): string => {
    switch (month.toLowerCase()) {
      case "jan": 
        return "1";
      case "feb":
        return "2";
      case "mar": 
        return "3"
      case "apr":
        return "4"
      case "may": 
        return "5"
      case "jun":
        return "6"
      case "jul":
        return "7"
      case "aug":
        return "8"
      case "sep":
        return "9"
      case "oct":
        return "10"
      case "nov":
        return "11"
      case "dec":
        return "12"
      default:
        return "0"
    }
  }

  return (
    <>
      {summary.status === "succeeded" ? (
        <div className="row g-3">
          <div className="col-md">
            <SummaryTile title="Income" body={summary.data.income} />
          </div>
          <div className="col-md">
            <SummaryTile title="Spending" body={summary.data.spending} />
          </div>
          <div className="col-md">
            <SummaryTile title="Savings" body={summary.data.savings} />
          </div>
          <div className="col-md">
            <SummaryTile title="Net Income" body={summary.data.net} />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Summary;
