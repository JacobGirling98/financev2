import React, { FC, useState } from "react";
import { useContext } from "react";
import { DateRange } from "../types/types";

interface IViewMoneyContext {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  selectedDateRanges: DateRange[];
  setSelectedDateRanges: (selected: DateRange[]) => void;
  dateRange: DateRange;
  setDateRange: (selected: DateRange) => void;
}

const defaultState: IViewMoneyContext = {
  timePeriod: "Financial Months",
  setTimePeriod: (period: string) => {},
  selectedDateRanges: [],
  setSelectedDateRanges: (selected: DateRange[]) => {},
  dateRange: {start: "", end: "", id: 0},
  setDateRange: (selected: DateRange) => {}
};

const ViewMoneyContext = React.createContext<IViewMoneyContext>(defaultState);

export const ViewMoneyProvider: FC = ({ children }) => {
  const [timePeriod, setTimePeriod] = useState<string>(defaultState.timePeriod);
  const [selectedDateRanges, setSelectedDateRanges] = useState<DateRange[]>(
    defaultState.selectedDateRanges
  );
  const [dateRange, setDateRange] = useState<DateRange>(defaultState.dateRange);

  return (
    <ViewMoneyContext.Provider
      value={{
        timePeriod,
        setTimePeriod,
        selectedDateRanges,
        setSelectedDateRanges,
        dateRange,
        setDateRange
      }}
    >
      {children}
    </ViewMoneyContext.Provider>
  );
};

export const useViewMoneyContext = () => useContext(ViewMoneyContext);
