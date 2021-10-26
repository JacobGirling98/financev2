export interface SelectOptions {
  readonly label: string;
  readonly value: string;
}

export interface Transaction {
  date: string;
  outgoing: boolean;
  value: string;
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
  descriptionMappings: DescriptionMapping[];
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

export interface ReduxFetchState {
  accounts: string[];
  categories: string[];
  descriptions: string[];
  incomeSources: string[];
  payees: string[];
  descriptionMappings: DescriptionMapping[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
}

export interface DescriptionMapping {
  fullDescription: string;
  shortDescription: string;
}
