import * as TYPES from "./types";

export interface SelectCpmProps {
  className?: string;
  index?: number;
  field?: string;
  options: string[];
  value: string;
  id: string;
  onChange?: (value: string) => void;
  nestedOnChange?: (
    index: number,
    field: string,
    value: string | boolean | number
  ) => void;
}

export interface TransactionRowProps {
  index: number;
  transaction: TYPES.Transaction;
  handleTransactionChange: (
    index: number,
    field: keyof TYPES.Transaction,
    value: string | boolean | number
  ) => void;
  transactionType: string;
}
