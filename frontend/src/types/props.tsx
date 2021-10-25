import { MouseEvent } from "react";
import * as TYPES from "./types";

export interface SelectCmpProps {
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

export interface CreatableSelectCmpProps {
  className?: string;
  index: number;
  field: string;
  options: string[];
  value: string;
  id: string;
  addOption: (newDescription: string) => void;
  nestedOnChange: (
    index: number,
    field: string,
    value: string | boolean | number
  ) => void;
}

export interface CurrencyCmpProps {
  value: string;
  className?: string;
  handleValueChange: (value: string) => void;
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
  removeRows: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
  removeRowsDisabled: boolean;
}
