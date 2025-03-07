'use client';
import { useState, useEffect, JSX } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaMoneyBillAlt,
  FaCreditCard,
  FaUtensils,
  FaBus,
  FaShoppingBag,
  FaCartPlus,
  FaWallet,
  FaPlus,
  FaExchangeAlt,
  FaArrowDown,
  FaArrowUp,
  FaChartLine
} from 'react-icons/fa';

interface Bank {
  id: string;
  name: string;
  icon: JSX.Element;
}

interface Balance {
  cash: number;
  bank: number;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: 'food' | 'travel' | 'shopping' | 'grocery' | 'other' | 'salary' | 'freelance' | 'investment';
  paymentMethod: 'cash' | 'bank';
  bank: Bank | null;
  date: string;
  type: 'credit' | 'debit';
}

interface NewTransaction {
  amount: string;
  description: string;
  category: 'food' | 'travel' | 'shopping' | 'grocery' | 'other' | 'salary' | 'freelance' | 'investment';
  paymentMethod: 'cash' | 'bank';
  bank: Bank | null;
  date: string;
  type: 'credit' | 'debit';
}

const banks: Bank[] = [
  { id: 'hdfc', name: 'HDFC Bank', icon: <FaCreditCard style={{ color: '#2563eb' }} /> },
  { id: 'sbi', name: 'SBI', icon: <FaCreditCard style={{ color: '#6d28d9' }} /> },
  { id: 'icici', name: 'ICICI', icon: <FaCreditCard style={{ color: '#ea580c' }} /> },
  { id: 'axis', name: 'Axis Bank', icon: <FaCreditCard style={{ color: '#dc2626' }} /> },
];

export default function ExpenseTracker() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({ cash: 5000, bank: 15000 });
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    amount: '',
    description: '',
    category: 'food',
    paymentMethod: 'cash',
    bank: null,
    date: new Date().toISOString().split('T')[0],
    type: 'debit'
  });

  // Load data from localStorage
  useEffect(() => {
    const transactionData = localStorage.getItem('transactions');
    const balanceData = localStorage.getItem('balance');

    if (transactionData) {
      setTransactions(JSON.parse(transactionData));
    }

    if (balanceData) {
      const parsedBalance = JSON.parse(balanceData);
      if (parsedBalance.cash && parsedBalance.bank) {
        setBalance(parsedBalance);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('balance', JSON.stringify(balance));
  }, [transactions, balance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    if (!amount || amount <= 0) return;

    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now(),
      amount: amount
    };

    setTransactions(prev => [...prev, transaction]);

    setBalance(prev => ({
      ...prev,
      [newTransaction.paymentMethod]: newTransaction.type === 'credit'
        ? prev[newTransaction.paymentMethod] + amount
        : prev[newTransaction.paymentMethod] - amount
    }));

    setNewTransaction({
      amount: '',
      description: '',
      category: 'food',
      paymentMethod: 'cash',
      bank: null,
      date: new Date().toISOString().split('T')[0],
      type: 'debit'
    });
  };

  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleBankOperation = (operation: string) => {
    router.push(`/${operation}`);
  };

  const operationButtons = [
    {
      label: 'Add Bank',
      icon: <FaPlus style={{ color: '#ffffff' }} />,
      onClick: () => handleBankOperation('add-bank'),
      bgColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Withdraw Cash',
      icon: <FaMoneyBillAlt style={{ color: '#ffffff' }} />,
      onClick: () => handleBankOperation('withdraw-cash'),
      bgColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'Deposit Cash',
      icon: <FaMoneyBillAlt style={{ color: '#ffffff' }} />,
      onClick: () => handleBankOperation('deposit-cash'),
      bgColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'Self Transfer',
      icon: <FaExchangeAlt style={{ color: '#ffffff' }} />,
      onClick: () => handleBankOperation('self-transfer'),
      bgColor: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const categoryOptions = {
    debit: ['food', 'travel', 'shopping', 'grocery', 'other'],
    credit: ['salary', 'freelance', 'investment', 'other']
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <FaUtensils style={{ color: '#ef4444' }} />;
      case 'travel': return <FaBus style={{ color: '#3b82f6' }} />;
      case 'shopping': return <FaShoppingBag style={{ color: '#8b5cf6' }} />;
      case 'grocery': return <FaCartPlus style={{ color: '#10b981' }} />;
      case 'salary': return <FaWallet style={{ color: '#16a34a' }} />;
      case 'investment': return <FaChartLine style={{ color: '#2563eb' }} />;
      default: return <FaWallet style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaWallet style={{ color: '#2563eb' }} /> Financial Tracker
      </h1>

      {/* Operation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {operationButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`${button.bgColor} p-4 rounded-lg flex flex-col items-center justify-center text-white transition-all hover:scale-105`}
          >
            <div className="text-2xl mb-2">{button.icon}</div>
            <span className="text-sm font-medium">{button.label}</span>
          </button>
        ))}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{totalCredits.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">₹{totalDebits.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Net Worth</h3>
          <p className="text-2xl font-bold text-gray-800">
            ₹{(balance.cash + balance.bank).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transaction Type Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setNewTransaction({ ...newTransaction, type: 'debit' })}
          className={`px-4 py-2 rounded-lg ${
            newTransaction.type === 'debit' 
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FaArrowDown className="inline mr-2" /> Expense
        </button>
        <button
          onClick={() => setNewTransaction({ ...newTransaction, type: 'credit' })}
          className={`px-4 py-2 rounded-lg ${
            newTransaction.type === 'credit' 
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FaArrowUp className="inline mr-2" /> Income
        </button>
      </div>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New {newTransaction.type === 'credit' ? 'Income' : 'Expense'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewTransaction({ ...newTransaction, paymentMethod: 'cash', bank: null })}
                  className={`p-2 rounded-lg flex items-center justify-center gap-2 ${
                    newTransaction.paymentMethod === 'cash'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaMoneyBillAlt /> Cash
                </button>
                <button
                  type="button"
                  onClick={() => setNewTransaction({ ...newTransaction, paymentMethod: 'bank' })}
                  className={`p-2 rounded-lg flex items-center justify-center gap-2 ${
                    newTransaction.paymentMethod === 'bank'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaCreditCard /> Bank
                </button>
              </div>
            </div>

            {newTransaction.paymentMethod === 'bank' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Select Bank</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newTransaction.bank?.id || ''}
                  onChange={(e) => {
                    const selectedBank = banks.find((b) => b.id === e.target.value);
                    setNewTransaction({ ...newTransaction, bank: selectedBank || null });
                  }}
                  required
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  category: e.target.value as NewTransaction['category']
                })}
              >
                {categoryOptions[newTransaction.type].map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <input
                type="text"
                placeholder="Enter description"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`mt-4 w-full p-3 rounded-lg font-medium transition-colors ${
            newTransaction.type === 'credit'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Add {newTransaction.type === 'credit' ? 'Income' : 'Expense'}
        </button>
      </form>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-700">Recent Transactions</h2>
        </div>
        <div className="divide-y">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className={`p-4 hover:bg-gray-50 ${
                transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <FaArrowUp className="text-green-600" />
                    ) : (
                      <FaArrowDown className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      ₹{transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {transaction.paymentMethod === 'bank' && transaction.bank ? (
                      <>
                        {transaction.bank.icon}
                        <span className="text-gray-600">{transaction.bank.name}</span>
                      </>
                    ) : (
                      <>
                        <FaMoneyBillAlt style={{ color: '#6b7280' }} />
                        <span className="text-gray-600">Cash</span>
                      </>
                    )}
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{transaction.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}