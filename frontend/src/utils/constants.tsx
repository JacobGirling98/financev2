import { TimePeriod } from "../types/types";

export const enum TRANSACTION_FIELDS {
  date = "date",
  outgoing = "outgoing",
  value = "value",
  transactionType = "transactionType",
  outboundAccount = "outboundAccount",
  inboundAccount = "inboundAccount",
  destination = "destination",
  source = "source",
  description = "description",
  category = "category",
  quantity = "quantity"
}

export const enum TRANSACTION_TYPES {
  bankTransfer = "Bank Transfer",
  credit = "Credit",
  debit = "Debit",
  income = "Income",
  personalTransfer = "Personal Transfer"
}

export const timePeriodsForSelect: TimePeriod[] = [
  { label: "Financial Months", value: "financial_months" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
  { label: "Financial Years", value: "financial_years" },
]