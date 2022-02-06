import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchDateRanges, setDateRange, setSelectedDateRanges, setTimePeriod, viewMoneyDateRange, viewMoneyDateRanges, viewMoneySelectedDateRanges, viewMoneyTimePeriod } from "../../stores/ViewMoneySlice";
import { DateRange, TimePeriod } from "../../types/types";
import { timePeriodsForSelect } from "../../utils/constants";
import SelectCmp from "../formComponents/SelectCmp";

const DateRangeSelects: React.FC = () => {
  const dispatch = useAppDispatch();
  const timePeriod = useAppSelector(viewMoneyTimePeriod);
  const dateRanges = useAppSelector(viewMoneyDateRanges);
  const selectedDateRanges = useAppSelector(viewMoneySelectedDateRanges);
  const dateRange = useAppSelector(viewMoneyDateRange);
  
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
  
  return (
    <>
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
    </>
  );
};

export default DateRangeSelects;
