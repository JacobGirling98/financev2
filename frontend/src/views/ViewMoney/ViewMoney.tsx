import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import SelectCmp from '../../components/formComponents/SelectCmp';
import { DATE_RANGES_URL } from '../../utils/api-urls';
import axios from 'axios';
import { DateRange, DateRangesData, DateRangesResponse, FinanceApiResponse, TimePeriod } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchDateRanges, fetchSummaryByDate, setDateRange, setSelectedDateRanges, setTimePeriod, viewMoneyDateRange, viewMoneyDateRanges, viewMoneySelectedDateRanges, viewMoneySummary, viewMoneyTimePeriod } from '../../stores/ViewMoneySlice';
import Spinner from '../../components/Spinner';
import { timePeriodsForSelect } from '../../utils/constants';


const ViewMoney: React.FC = () => {
  const dispatch = useAppDispatch();
  const timePeriod = useAppSelector(viewMoneyTimePeriod);
  const dateRanges = useAppSelector(viewMoneyDateRanges);
  const selectedDateRanges = useAppSelector(viewMoneySelectedDateRanges);
  const dateRange = useAppSelector(viewMoneyDateRange);
  const summary = useAppSelector(viewMoneySummary)

  useEffect(() => {
    dispatch(fetchDateRanges());
  }, [dispatch])

  useEffect(() => {
    if (dateRanges.status === "succeeded" && dateRanges.data) {
      let targetDateRange: DateRange[];
      switch (timePeriod) {
        case timePeriodsForSelect[0].label: {
          targetDateRange = dateRanges.data.financial_months;
          break;
        }
        case timePeriodsForSelect[1].label: {
          targetDateRange = dateRanges.data.months;
          break;
        }
        case timePeriodsForSelect[2].label: {
          targetDateRange = dateRanges.data.years;
          break;
        }
        case timePeriodsForSelect[3].label: {
          targetDateRange = dateRanges.data.financial_years;
          break;
        }
        default: {
          targetDateRange = dateRanges.data.financial_months;
          break;
        }
      }
      dispatch(setSelectedDateRanges(targetDateRange));
    }
  }, [dispatch, timePeriod, dateRanges])

  useEffect(() => {
    dispatch(setDateRange(selectedDateRanges[0]));
  }, [dispatch, selectedDateRanges]);

  useEffect(() => {
    if (dateRange) {
      const start = formatDateRequestParam(dateRange.start)
      const end = formatDateRequestParam(dateRange.end)
      dispatch(fetchSummaryByDate({ start, end }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dateRange])

  const formatDateRequestParam = (date: Date): string => {
    const split: string[] = date.toString().split(" ");
    return `${split[3]}-${monthToNumber(split[2])}-${split[1]}`
  }

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

  const handleTimePeriodChange = (label: TimePeriod["label"]): void => {
    const newPeriod: TimePeriod["label"] | undefined = getTimePeriodValue(label);
    if (newPeriod) {
      dispatch(setTimePeriod(newPeriod));
    }
  }

  const getTimePeriodValue = (label: TimePeriod["label"]): TimePeriod["label"] | undefined => {
    return timePeriodsForSelect.find(period => period.label === label)?.label
  }

  const formatDateString = (date: Date): string => {
    const splitDate: string[] = date.toString().split(" ");
    const year: string = splitDate[3].substring(2,);
    return `${splitDate[1]} ${splitDate[2]} ${year}`;
  }

  const mapDateRangeToString = (dateRange: DateRange | undefined): string => {
    return dateRange ? `${formatDateString(dateRange.start)} - ${formatDateString(dateRange.end)}` : "";
  }

  const handleDateRangeChange = (label: string): void => {
    const newDateRange: DateRange | undefined = getDateRange(label);
    if (newDateRange) 
      dispatch(setDateRange(newDateRange));
  }

  const getDateRange = (label: string): DateRange | undefined => {
    return selectedDateRanges.find(range => mapDateRangeToString(range) === label);
  }

  const readyToRender: boolean = dateRange !== null;

  return (
    <>
      {readyToRender ? (
        <div className="mx-auto w-75">
          <div className="g-3 clearfix d-flex flex-row">
            <div className="d-flex flex-grow-1">
              <h1 className="display-4">View Money</h1>
            </div>
            <div className="d-flex flex-row justify-content-end align-items-center">
              <SelectCmp
                className="form-Select px-1"
                options={timePeriodsForSelect.map(val => val.label)}
                id="dates"
                value={timePeriod}
                onChange={e => handleTimePeriodChange(e as TimePeriod["label"])}
              />
              <SelectCmp
                className="form-Select px-1"
                options={selectedDateRanges.map(val => {
                  return mapDateRangeToString(val);
                })}
                id="dates"
                value={mapDateRangeToString(dateRange)}
                onChange={e => handleDateRangeChange(e)}
              />
            </div>
          </div>
          {summary.status === "succeeded" ? (
            <div className="row g-3">
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body">
                    <h4 className="card-text d-flex justify-content-center fst-italic fw-light">Income</h4>
                    <h2 className="card-text d-flex justify-content-center fw-light">{summary.data.income}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body -dflex justify-content-center">
                    <h4 className="card-text d-flex justify-content-center fst-italic fw-light">Spending</h4>
                    <h2 className="card-text d-flex justify-content-center fw-light">{summary.data.spending}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body">
                    <h4 className="card-text d-flex justify-content-center fst-italic fw-light">Savings</h4>
                    <h2 className="card-text d-flex justify-content-center fw-light">{summary.data.savings}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body">
                    <h4 className="card-text d-flex justify-content-center fst-italic fw-light">Net Income</h4>
                    <h2 className="card-text d-flex justify-content-center fw-light">{summary.data.net}</h2>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      ) : null}
    </>
  );
}

export default ViewMoney;