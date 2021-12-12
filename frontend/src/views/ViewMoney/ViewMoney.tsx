import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import SelectCmp from '../../components/formComponents/SelectCmp';
import { DATE_RANGES_URL } from '../../utils/api-urls';
import axios from 'axios';
import { DateRange, DateRangesData, DateRangesResponse } from '../../types/types';

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
  const [dateRanges, setDateRanges] = useState<DateRangesData>();
  const [selectedDateRanges, setSelectedDateRanges] = useState<DateRange[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>();

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

  // useEffect(() => {
  //   console.log(selectedDateRanges);
  // }, [selectedDateRanges]);

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

  const mapDateRangeToString = (dateRange: DateRange): string => {
    return `${formatDateString(dateRange.start)} - ${formatDateString(dateRange.end)}`;
  }

  const readyToRender: boolean = selectedDateRanges !== null;

  return (
    <>
      {readyToRender ? (
        <div className="mx-auto w-75">
          <div className="row g-3 clearfix">
            <div className="float-start">
              <h1 className="display-4">View Money</h1>
            </div>
            <div className="float-end">
              <SelectCmp
                className="form-Select"
                options={timePeriods.map(val => val.label)}
                id="dates"
                value={timePeriod}
                onChange={e => handleTimePeriodChange(e)}
              />
              <SelectCmp
                className="form-Select"
                options={selectedDateRanges.map(val => {
                  console.log(val);

                  return mapDateRangeToString(val);
                })}
                id="dates"
                value={timePeriod}
                onChange={e => handleTimePeriodChange(e)}
              />
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ViewMoney;