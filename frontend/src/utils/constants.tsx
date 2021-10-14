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