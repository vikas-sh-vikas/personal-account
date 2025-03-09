import TransactionItem from "./TransactionItem";
import { Transaction } from "../types/types";

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-700">
          Recent Transactions
        </h2>
      </div>
      <div className="divide-y">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
