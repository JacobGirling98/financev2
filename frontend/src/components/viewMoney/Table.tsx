import React, { useEffect, useState } from "react";

import MaterialTable, { Column } from "material-table";
import tableIcons from "./TableIcons";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTransactionsByDate, viewMoneyDateRange, viewMoneyTransactions } from "../../stores/ViewMoneySlice";
import { TransactionsTableRow } from "../../types/types";
import { useViewMoneyContext } from "../../context/ViewMoney";


interface TableProps {
  title: string
}

const columns: Column<TransactionsTableRow>[] = [
  { title: "Date", field: "date", type:"date" },
  { title: "Category", field: "category" },
  { title: "Description", field: "description" },
  { title: "Quantity", field: "quantity", type: "numeric" },
  { title: "Value", field: "value", type: "currency", currencySetting: { currencyCode: "GBP" } },
];

const Table: React.FC<TableProps> = ({
  title
}) => {
  const dispatch = useAppDispatch();
  const { dateRange } = useViewMoneyContext()
  const transactions = useAppSelector(viewMoneyTransactions);

  useEffect(() => {
    const formatDateRequestParam = (date: Date): string => {
      const split: string[] = date.toString().split(" ");
      return `${split[3]}-${monthToNumber(split[2])}-${split[1]}`
    }

    if (dateRange) {
      // const start = formatDateRequestParam(dateRange.start)
      // const end = formatDateRequestParam(dateRange.end)
      const start = dateRange.start
      const end = dateRange.end
      dispatch(fetchTransactionsByDate({ start, end }))
    }
  }, [dispatch, dateRange])

  const localData = transactions.data.map(o => ({ ...o }));

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
    <MaterialTable 
      title={title}
      columns={columns} 
      data={localData}
      icons={tableIcons}
    />
  )
};

export default Table