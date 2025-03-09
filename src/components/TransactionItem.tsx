import { FaMoneyBillAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Transaction } from "../types/types";

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <div
      className={`p-4 hover:bg-gray-50 ${
        transaction.type === "credit" ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-full ${
              transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {transaction.type === "credit" ? (
              <FaArrowUp className="text-green-600" />
            ) : (
              <FaArrowDown className="text-red-600" />
            )}
          </div>
          <div>
            <p
              className={`font-medium ${
                transaction.type === "credit"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              ₹{transaction.amount}
            </p>
            <p className="text-sm text-gray-500">{transaction.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {transaction.paymentMethod === "bank" && transaction.bank ? (
              <>
                {/* {transaction.bank.icon} */}
                <span className="text-gray-600">{transaction.bank.name}</span>
              </>
            ) : (
              <>
                <FaMoneyBillAlt style={{ color: "#6b7280" }} />
                <span className="text-gray-600">Cash</span>
              </>
            )}
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">{transaction.date}</span>
        </div>
      </div>
    </div>
  );
}
