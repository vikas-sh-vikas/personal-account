"use client";
import { FaMoneyBillAlt, FaCreditCard } from "react-icons/fa";
import { TransactionFormProps } from "../types/types";

export default function TransactionForm({
  newTransaction,
  banks,
  onInputChange,
  onPaymentMethodChange,
  onBankChange,
  onSubmit,
  onTypeChange,
}: TransactionFormProps) {
  const categoryOptions = {
    debit: [
      { label: "food", value: 1 },
      { label: "travel", value: 2 },
      { label: "shopping", value: 3 },
      { label: "grocery", value: 4 },
      { label: "food", value: 5 },
    ],
    credit: [
      { label: "salary", value: 1 },
      { label: "travel", value: 2 },
      { label: "investment", value: 3 },
      { label: "other", value: 4 },
    ],
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Add New {newTransaction.type === "credit" ? "Income" : "Expense"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newTransaction.amount}
              onChange={onInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onPaymentMethodChange("cash")}
                className={`p-2 rounded-lg flex items-center justify-center gap-2 ${
                  newTransaction.paymentMethod === "cash"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <FaMoneyBillAlt /> Cash
              </button>
              <button
                type="button"
                onClick={() => onPaymentMethodChange("bank")}
                className={`p-2 rounded-lg flex items-center justify-center gap-2 ${
                  newTransaction.paymentMethod === "bank"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <FaCreditCard /> Bank
              </button>
            </div>
          </div>

          {newTransaction.paymentMethod === "bank" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Bank
              </label>
              <select
                name="bank"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newTransaction.bank?._id || ""}
                onChange={(e) => onBankChange(e.target.value)}
                required
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              name="category"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newTransaction.category}
              onChange={onInputChange}
            >
              <option value="">Select a category</option>
              {categoryOptions[newTransaction.type].map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newTransaction.date}
              onChange={onInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Enter description"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newTransaction.description}
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`mt-4 w-full p-3 rounded-lg font-medium transition-colors ${
          newTransaction.type === "credit"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        Add {newTransaction.type === "credit" ? "Income" : "Expense"}
      </button>
    </form>
  );
}
