"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaMoneyBillAlt,
  FaArrowLeft,
  FaEdit,
} from "react-icons/fa";

// Interface definitions
interface Bank {
  _id: string;
  name: string;
  balance: number;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Reusable Modal component
const Modal = ({
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

// Component to display each bank card
const BankCard = ({
  bank,
  onEdit,
  onDeposit,
  onWithdraw,
  onTransfer,
}: {
  bank: Bank;
  onEdit: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}) => (
  <div className="p-4 bg-white rounded-xl shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{bank.name}</h3>
        <FaEdit
          onClick={onEdit}
          className="cursor-pointer hover:text-blue-600"
          title="Edit bank details"
        />
      </div>
      <span className="text-xl font-bold">₹{bank.balance}</span>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onDeposit}
        className="bg-green-100 text-green-600 px-2 py-1 rounded flex items-center justify-center text-sm hover:bg-green-200"
      >
        <FaMoneyBillAlt className="mr-1" /> Deposit
      </button>
      <button
        onClick={onWithdraw}
        className="bg-red-100 text-red-600 px-2 py-1 rounded flex items-center justify-center text-sm hover:bg-red-200"
      >
        <FaMoneyBillWave className="mr-1" /> Withdraw
      </button>
      <button
        onClick={onTransfer}
        className="bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center justify-center text-sm hover:bg-blue-200"
      >
        <FaExchangeAlt className="mr-1" /> Transfer
      </button>
    </div>
  </div>
);

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddCash, setShowAddCash] = useState(false);
  const [bankDetail, setBankDetail] = useState<Bank>({
    _id: "",
    name: "",
    balance: 0,
  });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [cash, setCash] = useState({ _id: "", amount: "" });
  const [transferTo, setTransferTo] = useState<string>("");
  const router = useRouter();

  // Load banks and cash on component mount
  useEffect(() => {
    bankList();
    getCash();
  }, []);

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

  const getCash = async () => {
    try {
      const response = await axios.get("/api/cash/getCash");
      const apiData = response.data.data[0];
      setCash(apiData);
    } catch (err) {
      console.error(err);
    }
  };

  // Add or update bank
  const addNewBank = async () => {
    if (!bankDetail.name || !bankDetail.balance) return;
    try {
      const bank = {
        _id: bankDetail._id ?? null,
        name: bankDetail.name,
        balance: bankDetail.balance,
      };
      await axios.post("/api/bank/addEditBanks", bank);
      bankList();
    } catch (err) {
      console.error(err);
    }
    setShowAddBank(false);
    setBankDetail({ _id: "", name: "", balance: 0 });
  };

  // Edit bank details
  const handleEdit = async (_id: string) => {
    try {
      const response = await axios.post("/api/bank/getBankById", { id: _id });
      setShowAddBank(true);
      setBankDetail({
        _id: response.data.data._id,
        balance: response.data.data.balance,
        name: response.data.data.name,
      });
      bankList();
    } catch (err) {
      console.error(err);
    }
  };

  // Deposit and withdraw functions
  const handleBankDeposit = async (id: string, depositAmount: string) => {
    try {
      await axios.post("/api/bank/addEditBanks", { _id: id, deposit: depositAmount });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBankWithdraw = async (id: string, withdrawAmount: string) => {
    try {
      await axios.post("/api/bank/addEditBanks", { _id: id, withdraw: withdrawAmount });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async () => {
    if (!selectedBank || !amount) return;
    await handleBankDeposit(selectedBank, amount);
    await bankList();
    setShowDeposit(false);
    setAmount("");
  };

  const handleWithdraw = async () => {
    if (!selectedBank || !amount) return;
    await handleBankWithdraw(selectedBank, amount);
    await bankList();
    setShowWithdraw(false);
    setAmount("");
  };

  // Transfer funds between banks
  const handleTransfer = async () => {
    if (!selectedBank || !transferTo || !amount) return;
    await handleBankWithdraw(selectedBank, amount);
    await handleBankDeposit(transferTo, amount);
    await bankList();
    setShowTransfer(false);
    setAmount("");
    setTransferTo("");
  };

  // Cash update functions
  const handleAddCash = async () => {
    try {
      const payload = { _id: cash._id, amount: amount };
      await axios.post("/api/cash/addEditCash", payload);
      getCash();
      setAmount("")
      setShowAddCash(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCash = async () => {
    try {
      const response = await axios.post("/api/cash/getCashById", { id: cash._id });
      setAmount(response.data.data.amount);
      setShowAddCash(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaArrowLeft
          onClick={() => router.push("/")}
          className="cursor-pointer hover:text-blue-600"
          title="Go back"
        />
        <h1 className="text-3xl font-bold">Bank Management</h1>
      </div>

      {/* Action Buttons & Totals */}
      <div className="my-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAddBank(!showAddBank);
                setShowAddCash(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FaPlus /> Add New Bank
            </button>
            <button
              onClick={handleEditCash}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FaPlus /> Edit Cash
            </button>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">
              Bank Total - ₹{banks.reduce((total, bank) => total + bank.balance, 0)}
            </p>
            <p className="text-xl font-bold">Cash Total - ₹{cash.amount}</p>
          </div>
        </div>

        {/* Add/Edit Bank Form */}
        {showAddBank && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankDetail.name}
                  onChange={(e) => setBankDetail({ ...bankDetail, name: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Balance</label>
                <input
                  type="number"
                  value={bankDetail.balance}
                  onChange={(e) =>
                    setBankDetail({ ...bankDetail, balance: parseFloat(e.target.value) })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter initial balance"
                />
              </div>
            </div>
            <button
              onClick={addNewBank}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {bankDetail._id ? "Update Bank" : "Add Bank"}
            </button>
          </div>
        )}

        {/* Edit Cash Modal */}
        {showAddCash && (
          <Modal
            title="Edit Cash"
            onCancel={() => {setShowAddCash(false);setAmount("")}}
            onConfirm={handleAddCash}
            confirmText="Save"
          >
            <input
              type="number"
              placeholder="Enter cash amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </Modal>
        )}
      </div>

      {/* Banks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {banks.map((bank) => (
          <BankCard
            key={bank._id}
            bank={bank}
            onEdit={() => handleEdit(bank._id)}
            onDeposit={() => {
              setSelectedBank(bank._id);
              setShowDeposit(true);
            }}
            onWithdraw={() => {
              setSelectedBank(bank._id);
              setShowWithdraw(true);
            }}
            onTransfer={() => {
              setSelectedBank(bank._id);
              setShowTransfer(true);
            }}
          />
        ))}
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <Modal
          title="Deposit Cash"
          onCancel={() => {setShowDeposit(false);setAmount('')}}
          onConfirm={handleDeposit}
          confirmText="Deposit"
        >
          <input
            type="number"
            placeholder="Enter amount to deposit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </Modal>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <Modal
          title="Withdraw Cash"
          onCancel={() => {setShowWithdraw(false),setAmount("")}}
          onConfirm={handleWithdraw}
          confirmText="Withdraw"
        >
          <input
            type="number"
            placeholder="Enter amount to withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </Modal>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <Modal
          title="Transfer Funds"
          onCancel={() => {setShowTransfer(false),setAmount("")}}
          onConfirm={handleTransfer}
          confirmText="Transfer"
        >
          <select
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          >
            <option value="">Select Destination Bank</option>
            {banks
              .filter((bank) => bank._id !== selectedBank)
              .map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
          </select>
          <input
            type="number"
            placeholder="Enter amount to transfer"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </Modal>
      )}
    </div>
  );
}
