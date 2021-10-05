export interface SelectOptions {
  label: string;
  value: string;
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
