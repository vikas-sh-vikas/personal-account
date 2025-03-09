// components/EditableTransactionList.tsx
"use client";
import { useState } from "react";
import { Transaction } from "../types/types";
import EditableTransactionItem from "./EditableTransactionItem";

export default function EditableTransactionList({
  transactions,
  onUpdate,
}: {
  transactions: Transaction[];
  onUpdate: (transaction: Transaction) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-700">Transactions</h2>
      </div>
      <div className="divide-y">
        {transactions.map((transaction) => (
          <EditableTransactionItem
            key={transaction._id}
            transaction={transaction}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}
