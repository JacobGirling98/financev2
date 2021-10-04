export interface SelectOptions {
  label: string;
  value: string;
}

export interface Transaction {
  date: string;
  outgoing: boolean;
  value: number;
  transactionType: string | null;
  outboundAccount: string | null;
  inboundAccount: string | null;
  destination: string | null;
  source: string | null;
  description: string;
  category: string;
  quantity: string;
}
