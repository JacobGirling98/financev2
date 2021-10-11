export interface SelectOptions {
  readonly label: string;
  readonly value: string;
}

export interface Transaction {
  date: string;
  outgoing: boolean;
  value: number | undefined;
  transactionType: string | undefined;
  outboundAccount: string;
  inboundAccount: string;
  destination: string;
  source: string;
  description: string;
  category: string;
  quantity: string;
}

export interface GetAllFormOptionsData {
  accounts: string[];
  categories: string[];
  descriptions: string[];
  incomeSource: string[];
  payees: string[];
}

export interface GetAllFormOptionsResponse {
  data: GetAllFormOptionsData
}

export interface CurrencyValues {
  formattedValue: string;
  value: string;
  floatValue: number
}

export interface Headers {
  "content-type": string;
}

export interface NewMoneyRequestData {
  transactions: Transaction[];
}

export interface NewMoneyRequest {
  method: string;
  url: string;
  headers: Headers;
  data: NewMoneyRequestData;
}
