// app/reports/page.tsx
"use client";
import EditableTransactionList from "@/components/EditableTransactionList";
import { Transaction } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const router = useRouter();
  useEffect(() => {
    transactionList();
  }, []);
  const transactionList = async () => {
    try {
      const response = await axios.get("/api/transaction/getTransaction");

      const apiData = response.data.data;
      const banksWithParsedBalance = await apiData.map((transaction: any) => ({
        _id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        category:transaction.category_id,
        paymentMethod: transaction.payment_method,
        bank: transaction.bannk_id,
        date: transaction.date,
        type: transaction.type,
      }));

      // console.log("Response", apiData);

      setTransactions(banksWithParsedBalance)
      // setBanks(apiData);

      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }
  };
  // Filter transactions by selected month
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(selectedMonth)
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t._id === updatedTransaction._id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center text-center gap-3">
        <FaArrowLeft onClick={() => router.push("/")} />
        <h1 className="text-3xl font-bold my-auto">Monthly Report</h1>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Month:
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border rounded-lg"
        />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Transactions for{" "}
          {new Date(selectedMonth).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </h2>
        <span className="text-gray-600">
          {filteredTransactions.length} transactions found
        </span>
      </div>

      <EditableTransactionList
        transactions={filteredTransactions}
        onUpdate={handleUpdateTransaction}
      />
    </div>
  );
}
