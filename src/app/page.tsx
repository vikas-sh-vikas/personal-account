"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCreditCard, FaWallet } from "react-icons/fa";
import { Balance, Bank, NewTransaction, Transaction } from "@/types/types";
import OperationButtons from "@/components/OperationButtons";
import BalanceCards from "@/components/BalanceCards";
import TransactionTypeToggle from "@/components/TransactionTypeToggle";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import axios from "axios";

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [balance, setBalance] = useState<Balance>({ cash: 5000, bank: 15000 });
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    amount: "",
    description: "",
    category: "",
    paymentMethod: "cash",
    bank: null,
    date: new Date().toISOString().split("T")[0],
    type: "debit",
  });
  useEffect(() => {
    bankList();
    transactionList();
    const balanceData = localStorage.getItem("balance");
    if (balanceData) {
      const parsedBalance = JSON.parse(balanceData);
      if (parsedBalance.cash && parsedBalance.bank) {
        setBalance(parsedBalance);
      }
    }
  }, []);
  const bankList = async () => {
    try {
      const response = await axios.get("/api/bank/getBanks");

      const apiData = response.data.data;
      const banksWithParsedBalance = await apiData.map((bank: any) => ({
        ...bank,
        balance: parseFloat(bank.balance),
      }));

      setBanks(apiData);

      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
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
  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
  }, [balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    if (!amount || amount <= 0) return;
    try {
      const payload = {
        // ...newTransaction,
        type:newTransaction.type,
        amount:newTransaction.amount,
        category_id: parseInt(newTransaction.category),
        payment_method: newTransaction.paymentMethod,
        date: newTransaction.date,
        description: newTransaction.description,
        bannk_id: newTransaction.bank?._id ?? "",
      };
      const response = await axios.post("/api/transaction/addEditTransaction", payload);
      console.log("Response", response);
      transactionList();
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }

    setBalance((prev) => ({
      ...prev,
      [newTransaction.paymentMethod]:
        newTransaction.type === "credit"
          ? prev[newTransaction.paymentMethod] + amount
          : prev[newTransaction.paymentMethod] - amount,
    }));

    setNewTransaction({
      amount: "",
      description: "",
      category: "food",
      paymentMethod: "cash",
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
      paymentMethod: method,
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
        totalCredits={transactions
          .filter((t) => t.type === "credit")
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)}
        totalDebits={transactions
          .filter((t) => t.type === "debit")
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)}
        netWorth={balance.cash + balance.bank}
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
