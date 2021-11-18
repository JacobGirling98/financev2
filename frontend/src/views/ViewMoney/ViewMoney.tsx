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
  const [timePeriod, setTimePeriod] = useState<string>("financial_months");
  const [dateRanges, setDateRanges] = useState<DateRangesData>();
  const [dateRange, setDateRange] = useState<DateRange>();

  useEffect(() => {
    const getDateRanges = async () => {
      const { data }: DateRangesResponse = await axios.get(DATE_RANGES_URL);
      setDateRanges(data);
    }
    getDateRanges();
  }, [])

  const handleTimePeriodChange = (label: string): void => {
    setTimePeriod(timePeriods.filter(period => period.label === label)[0].value);
  }

  return (
    <>
      <div className="mx-auto w-75">
        <div className="row g-3">
          <div className="col-md-10">
            <h1 className="display-4">View Money</h1>
          </div>
          <div className="col-md-1">
            <SelectCmp
              className="form-Select"
              options={timePeriods.map(val => val.label)}
              id="dates"
              value={timePeriod}
              onChange={e => setTimePeriod(e)}
            />
          </div>
          <div className="col-md-1">
            
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md">
            <div className="card p-3">
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md">
            <div className="card p-3">
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md">
            <div className="card p-3">
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md">
            <div className="card p-3">
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewMoney;