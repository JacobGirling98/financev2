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

export interface FinanceApiResponse<T> {
  data: T
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

export interface FormOptionsState {
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

export interface DateRange {
  start: Date;
  end: Date;
  id: number;
}

export interface DateRangesData {
  financial_months: DateRange[];
  months: DateRange[];
  years: DateRange[];
  financial_years: DateRange[];
}

export interface DateRangesResponse {
  data: DateRangesData
}

export interface ViewMoneySummary {
  income: number;
  spending: number;
  savings: number;
  net: number;
}

export interface TransactionsTableRow {
  date: string;
  category: string;
  description: string;
  quantity: number;
  value: number;
}

export interface ViewMoneyState {
  summary: { data: ViewMoneySummary, status: string | undefined },
  timePeriod: TimePeriod["label"],
  dateRanges: { data: DateRangesData, status: string | undefined },
  selectedDateRanges: DateRange[],
  dateRange?: DateRange,
  transactions: { data: TransactionsTableRow[], status: string | undefined }
}

export interface TimePeriod {
  label: "Financial Months" | "Financial Years" | "Months" | "Years";
  value: "financial_months" | "financial_years" | "months" | "years";
}
