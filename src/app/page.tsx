"use client";
import { useState, useEffect } from "react";
import {  FaWallet } from "react-icons/fa";
import {  Bank, Transaction } from "@/types/types";
import OperationButtons from "@/components/OperationButtons";
import BalanceCards from "@/components/BalanceCards";
import TransactionTypeToggle from "@/components/TransactionTypeToggle";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import axios from "axios";

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    _id:"",
    amount: "",
    description: "",
    category: "",
    payment_method: "cash",
    bank: null,
    date: new Date().toISOString().split("T")[0],
    type: "debit",
  });
  useEffect(() => {
    bankList();
    transactionList();
  }, []);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(",", ""); // Removes the comma
  };
  const bankList = async () => {
    try {
      const response = await axios.get("/api/bank/getBanks");
      const apiData = response.data.data;
      setBanks(apiData);
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }
  };
  const transactionList = async () => {
    try {
      const response = await axios.get("/api/transaction/getRecentTransaction");

      const apiData = response.data.data;

      const banksWithParsedBalance = await apiData.map((transaction: any) => ({
        _id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category_id,
        payment_method: transaction.payment_method,
        bank: transaction.bank_id,
        date: formatDate(transaction.date), // Example: "01-Jan-2024"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    if (!amount || amount <= 0) return;
    try {
      const payload = {
        // ...newTransaction,
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
      // console.log("Response", response);
      transactionList();
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }

    setNewTransaction({
      _id:"",
      amount: "",
      description: "",
      category: "food",
      payment_method: "cash",
      bank: null,
      date: new Date().toISOString().split("T")[0],
      type: "debit",
    });
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
  // console.log("New Transaction", newTransaction);
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaWallet style={{ color: "#2563eb" }} /> Financial Tracker
      </h1>

      <OperationButtons />

      <BalanceCards
      />

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
      <TransactionList transactions={transactions} />
    </div>

  );
}
