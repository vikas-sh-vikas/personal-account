// app/reports/page.tsx
"use client";
import EditableTransactionList from "@/components/EditableTransactionList";
import TransactionForm from "@/components/TransactionForm";
import TransactionTypeToggle from "@/components/TransactionTypeToggle";
import { Bank, Transaction } from "@/types/types";
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
    bankList();
  }, []);
  const [isEdit, setIsEdit] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);

  const [newTransaction, setNewTransaction] = useState<Transaction>({
    _id: "",
    amount: "",
    description: "",
    category: "",
    payment_method: "cash",
    bank: null,
    date: new Date().toISOString().split("T")[0],
    type: "debit",
  });
  const bankList = async () => {
    try {
      const response = await axios.get("/api/bank/getBanks");
      const apiData = response.data.data;
      const banksWithParsedBalance = apiData.map((bank: any) => ({
        ...bank,
        balance: parseFloat(bank.balance),
      }));
      setBanks(banksWithParsedBalance);
    } catch (err) {
      console.error(err);
    }
  };
  const transactionList = async () => {
    try {
      const response = await axios.get("/api/transaction/getTransaction");

      const apiData = response.data.data;
      const banksWithParsedBalance = await apiData.map((transaction: any) => ({
        _id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category_id,
        payment_method: transaction.payment_method,
        bank:
          transaction.bank_id == null
            ? null
            : {
                value: transaction.bank_id._id,
                name: transaction.bank_id.name,
              },
        date: transaction.date,
        type: transaction.type,
      }));

      // console.log("Response", apiData);

      setTransactions(banksWithParsedBalance);
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

  // const handleUpdateTransaction = (updatedTransaction: Transaction) => {
  //   const updatedTransactions = transactions.map((t) =>
  //     t._id === updatedTransaction._id ? updatedTransaction : t
  //   );
  //   setTransactions(updatedTransactions);
  //   localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  // };
  const handleUpdateTransaction = async (id: string) => {
    setIsEdit(true);
    try {
      const response = await axios.post("/api/transaction/getTransactionById", {
        id: id,
      });
      // setAmount(response.data.data.amount);
      // setShowAddCash(true);
      const apiData = await response.data.data;
      setNewTransaction({
        ...apiData,
        category: apiData.category_id,
        bank: { _id: apiData.bank_id },
        date: apiData.date
          ? new Date(apiData.date).toISOString().split("T")[0]
          : "",
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // console.log("Input Change-=---->", e.target.name);
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value,
    });
  };
  const handlePaymentMethodChange = (method: "cash" | "bank") => {
    setNewTransaction({
      ...newTransaction,
      payment_method: method,
      bank: method === "cash" ? null : newTransaction.bank,
    });
  };
  const handleBankChange = (bankId: string) => {
    const selectedBank = banks.find((b) => b._id === bankId);
    setNewTransaction({ ...newTransaction, bank: selectedBank || null });
  };
  const handleTypeChange = (type: "credit" | "debit") => {
    setNewTransaction({
      ...newTransaction,
      type,
      category: type === "credit" ? "salary" : "food",
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    if (!amount || amount <= 0) return;
    try {
      const payload = {
        // ...newTransaction,
        _id: newTransaction._id,
        type: newTransaction.type,
        amount: newTransaction.amount,
        category_id: parseInt(newTransaction.category),
        payment_method: newTransaction.payment_method,
        date: newTransaction.date,
        description: newTransaction.description,
        bank_id: newTransaction.bank?._id ?? "",
      };
      const response = await axios.post(
        "/api/transaction/addEditTransaction",
        payload
      );
      console.log("Response", response);
      transactionList();
      setIsEdit(false);
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }

    // setBalance((prev) => ({
    //   ...prev,
    //   [newTransaction.paymentMethod]:
    //     newTransaction.type === "credit"
    //       ? prev[newTransaction.paymentMethod] + amount
    //       : prev[newTransaction.paymentMethod] - amount,
    // }));

    setNewTransaction({
      _id: "",
      amount: "",
      description: "",
      category: "food",
      payment_method: "cash",
      bank: null,
      date: new Date().toISOString().split("T")[0],
      type: "debit",
    });
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
      {isEdit ? (
        <>
          <TransactionTypeToggle
            type={newTransaction.type}
            onTypeChange={handleTypeChange}
          />
          <TransactionForm
            newTransaction={newTransaction}
            banks={banks}
            onInputChange={handleInputChange}
            onPaymentMethodChange={handlePaymentMethodChange}
            onBankChange={handleBankChange}
            onSubmit={handleSubmit}
            onTypeChange={handleTypeChange}
          />
        </>
      ) : (
        <></>
      )}
      <EditableTransactionList
        transactions={filteredTransactions}
        onUpdateForm={handleUpdateTransaction}
      />
    </div>
  );
}
