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
  descriptions: string[];
  setDescriptions: (newDescriptions: string[]) => void;
  nestedOnChange: (
    index: number,
    field: string,
    value: string | boolean | number
  ) => void;
}

export interface TransactionRowProps {
  index: number;
  transaction: TYPES.Transaction;
  accounts: string[];
  categories: string[];
  descriptions: string[];
  incomeSources: string[];
  payees: string[];
  handleTransactionChange: (
    index: number,
    field: keyof TYPES.Transaction,
    value: string | boolean | number
  ) => void;
  transactionType: string;
  setDescriptions: (newDescriptions: string[]) => void;
  removeRows: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
  removeRowsDisabled: boolean;
}
