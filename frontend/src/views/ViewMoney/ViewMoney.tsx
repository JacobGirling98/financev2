import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import SelectCmp from '../../components/formComponents/SelectCmp';
import { DATE_RANGES_URL } from '../../utils/api-urls';
import axios from 'axios';
import { DateRange, DateRangesData, DateRangesResponse } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchSummaryByDate, viewMoneySummary } from '../../stores/ViewMoneySlice';
import Spinner from '../../components/Spinner';

interface TimePeriod {
  label: string;
  value: string;
}

const timePeriods: TimePeriod[] = [
  { label: "Financial Months", value: "financial_months" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
  { label: "Financial Years", value: "financial_years" },
]

const ViewMoney: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<string>("Financial Months");
  const [dateRanges, setDateRanges] = useState<DateRangesData>(); // all data ranges
  const [selectedDateRanges, setSelectedDateRanges] = useState<DateRange[]>([]); // chosen date range based on time period
  const [dateRange, setDateRange] = useState<DateRange>(); // chosen date range from selectedDateRanges

  const summary = useAppSelector(viewMoneySummary)
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getDateRanges = async () => {
      const { data }: DateRangesResponse = await axios.get(DATE_RANGES_URL);
      setDateRanges(data);
    }
    getDateRanges();
  }, [])

  useEffect(() => {
    if (dateRanges) {
      switch (timePeriod) {
        case timePeriods[0].label: {
          setSelectedDateRanges(dateRanges.financial_months);
          break;
        }
        case timePeriods[1].label: {
          setSelectedDateRanges(dateRanges.months);
          break;
        }
        case timePeriods[2].label: {
          setSelectedDateRanges(dateRanges.years);
          break;
        }
        case timePeriods[3].label: {
          setSelectedDateRanges(dateRanges.financial_years);
          break;
        }
        default: {
          setSelectedDateRanges(dateRanges.financial_months);
          break;
        }
      }
    }
  }, [timePeriod, dateRanges])

  useEffect(() => {
    setDateRange(selectedDateRanges[0]);
  }, [selectedDateRanges]);

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

  const handleTimePeriodChange = (label: string): void => {
    const newPeriod: string | undefined = getTimePeriodValue(label);
    if (newPeriod) {
      setTimePeriod(newPeriod);
    }
  }

  const getTimePeriodValue = (label: string): string | undefined => {
    return timePeriods.find(period => period.label === label)?.label
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
      setDateRange(newDateRange);
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
                options={timePeriods.map(val => val.label)}
                id="dates"
                value={timePeriod}
                onChange={e => handleTimePeriodChange(e)}
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
                    <h5 className="card-title">Income</h5>
                    <p className="card-text">{summary.data.income}</p>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body">
                    <h5 className="card-title">Spending</h5>
                    <p className="card-text">{summary.data.spending}</p>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body">
                    <h5 className="card-title">Savings</h5>
                    <p className="card-text">{summary.data.savings}</p>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card p-3">
                  <div className="card-body">
                    <h5 className="card-title">Net Income</h5>
                    <p className="card-text">{summary.data.net}</p>
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