import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getDateRanges } from "../../api/ViewMoney";
import { useViewMoneyContext } from "../../context/ViewMoney";
import { DateRange, DateRangesData, TimePeriod } from "../../types/types";
import { timePeriodsForSelect } from "../../utils/constants";
import SelectCmp from "../formComponents/SelectCmp";

const DateRangeSelects: React.FC = () => {

  const { 
    timePeriod,
    setTimePeriod,
    selectedDateRanges,
    setSelectedDateRanges,
    dateRange,
    setDateRange
   } = useViewMoneyContext()
  
  const { data: dateRanges, isSuccess} = useQuery<DateRangesData>("fetchDateRanges", () => getDateRanges())

  useEffect(() => {
    if (isSuccess && !!dateRanges) {
      let targetDateRange: DateRange[];
      switch (timePeriod) {
        case timePeriodsForSelect[0].label: {
          targetDateRange = dateRanges.financial_months;
          break;
        }
        case timePeriodsForSelect[1].label: {
          targetDateRange = dateRanges.months;
          break;
        }
        case timePeriodsForSelect[2].label: {
          targetDateRange = dateRanges.years;
          break;
        }
        case timePeriodsForSelect[3].label: {
          targetDateRange = dateRanges.financial_years;
          break;
        }
        default: {
          targetDateRange = dateRanges.financial_months;
          break;
        }
      }
      setSelectedDateRanges(targetDateRange);
    }
  }, [timePeriod, dateRanges, setSelectedDateRanges, isSuccess])

  useEffect(() => {
    if (selectedDateRanges.length > 0)
      setDateRange(selectedDateRanges[0]);
  }, [setDateRange, selectedDateRanges]);

  const handleTimePeriodChange = (label: TimePeriod["label"]): void => {
    const newPeriod: TimePeriod["label"] | undefined = getTimePeriodValue(label);
    if (newPeriod) {
      setTimePeriod(newPeriod);
    }
  }

  const getTimePeriodValue = (label: TimePeriod["label"]): TimePeriod["label"] | undefined => {
    return timePeriodsForSelect.find(period => period.label === label)?.label
  }

  const formatDateRange = (date: DateRange | undefined): string => {
    if (!!date) {
      switch (timePeriod) {
        case timePeriodsForSelect[0].label:
          return formatFinancialMonthDateRange(date)
        case timePeriodsForSelect[1].label:
            return formatMonthDateRange(date)
        case timePeriodsForSelect[2].label:
          return formatYearDateRange(date)
        case timePeriodsForSelect[3].label:
          return formatFinancialYearDateRange(date)
      }
    }
    return ""
  }

  const formatFinancialMonthDateRange = (dateRange: DateRange): string => {
    return `${formatMonth(dateRange.start)} - ${formatMonth(dateRange.end)}`; 
  }

  const formatMonthDateRange = (dateRange: DateRange): string => {
    return formatMonth(dateRange.start); 
  }

  const formatYearDateRange = (dateRange: DateRange): string => {
    return dateRange.start.split("-")[0]
  }

  const formatFinancialYearDateRange = (dateRange: DateRange): string => {
    return `${dateRange.start.split("-")[0]} - ${dateRange.end.split("-")[0]}`
  }

  const formatMonth = (date: string): string => {
    const splitDate = date.split("-")
    return `${monthFromNumber(splitDate[1])} ${shortenYear(splitDate[0])}`
  }

  const shortenYear = (year: string): string => {
    return year.substring(2,);
  }
  
  const handleDateRangeChange = (label: string): void => {
    const newDateRange: DateRange | undefined = getDateRange(label);
    if (!!newDateRange && setDateRange) 
      setDateRange(newDateRange);
  }

  const getDateRange = (label: string): DateRange | undefined => {
    return selectedDateRanges.find(range => formatDateRange(range) === label);
  }

  const monthFromNumber = (number: string): string => {
    switch (number) {
      case "01":
        return "Jan"
      case "02":
        return "Feb"
      case "03":
        return "Mar"
      case "04":
        return "Apr"
      case "05":
        return "May"
      case "06":
        return "Jun"
      case "07":
        return "Jul"
      case "8":
        return "Aug"
      case "09":
        return "Sep"
      case "10":
        return "Oct"
      case "11":
        return "Nov"
      case "12":
        return "Dec"
      }
    return "-"
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
          return formatDateRange(val);
        })}
        id="dates"
        value={formatDateRange(dateRange)}
        onChange={e => handleDateRangeChange(e)}
      />
    </>
  );
};

export default DateRangeSelects;
