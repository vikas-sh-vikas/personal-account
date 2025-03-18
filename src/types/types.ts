import { JSX } from "react";

export interface Bank {
  _id: string;
  name: string;
  value?:string;
  // icon: JSX.Element;
}

export interface Balance {
  cash: number;
  bank: number;
}

export interface Transaction {
  _id?: string;
  amount: string;
  description: string;
  category:string;
  payment_method: "cash" | "bank";
  bank: Bank | null;
  date: string;
  type: "credit" | "debit";
}

export type TransactionFormProps = {
  newTransaction: Transaction;
  banks: Bank[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onPaymentMethodChange: (method: "cash" | "bank") => void;
  onBankChange: (bankId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTypeChange: (type: "credit" | "debit") => void;
};
