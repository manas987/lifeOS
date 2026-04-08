export type Transaction = {
  id: string;
  title?: string;
  amount: number;
  category?: string;
  date: string;
  mode: "income" | "expense" | "transfer";
  accountId: string;
  toAccountId?: string;
  note?: string;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export type DetailRecentTransactionsCardprops = {
  data: Transaction[];
  onUpdate: (
    id: string,
    field: keyof Transaction,
    value: Transaction[keyof Transaction],
  ) => void;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  nextDue: string;
  repeatEvery: string;
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
};

export type TrackKind = "debt" | "lent";

export type TrackItem = {
  id: string;
  kind: TrackKind;
  name: string;
  total: number;
  done: number;
};
 