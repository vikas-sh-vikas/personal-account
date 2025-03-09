// app/banks/page.tsx
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, JSX } from "react";
import {
  FaPlus,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaCreditCard,
  FaMoneyBillAlt,
  FaArrowLeft,
  FaEdit,
} from "react-icons/fa";

interface Bank {
  _id: string;
  name: string;
  balance: number;
}

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddCash, setShowAddCash] = useState(false);
  const [bankDetail,setBankDetail] =useState<Bank>({
    _id: "",
    name: "",
    balance: 0,
  })
  // const [newBankName, setNewBankName] = useState("");
  // const [newBankBalance, setNewBankBalance] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [transferTo, setTransferTo] = useState<string>("");
  const router = useRouter();
  // Load banks from localStorage
  useEffect(() => {
    bankList();
  }, []);

  const bankList = async () => {
    console.log("TestAPI");
    try {
      const response = await axios.get("/api/bank/getBanks");

      const apiData = response.data.data;
      const banksWithParsedBalance = await apiData.map((bank: any) => ({
        ...bank,
        balance: parseFloat(bank.balance),
      }));
      console.log("Response", banksWithParsedBalance);

      setBanks(banksWithParsedBalance);

      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }
  };
  // Save banks to localStorage
  // useEffect(() => {
  //   localStorage.setItem("banks", JSON.stringify(banks));
  // }, [banks]);
  

  
  const addNewBank = async () => {
    if (!bankDetail.name || !bankDetail.balance) return;

    console.log("TestAPI");
    try {
      const bank = {
        _id: bankDetail._id ?? null,
        name: bankDetail.name,
        balance: bankDetail.balance,
      };

      const response = await axios.post("/api/bank/addEditBanks", bank);
      console.log("Response", response);
      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
      bankList();
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }

    // setBanks([...banks, newBank]);
    setShowAddBank(false);
    setBankDetail({
      _id: "",
      name: "",
      balance: 0,
    })
  };
  const handleEdit = async (_id:string) => {
    // if (!bankDetail.name || !bankDetail.balance) return;

    // console.log("TestAPI");
    try {
      const bank = {
        id: _id,
      };

      const response = await axios.post("/api/bank/getBankById", bank);
      console.log("Response", response);
      setShowAddBank(true)
      setBankDetail({
        ...bankDetail,
        _id:response.data.data._id,
        balance:response.data.data.balance,
        name:response.data.data.name,
      })
      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
      bankList();
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }

    // setBanks([...banks, newBank]);
    // setShowAddBank(false);
    // setBankDetail({
    //   _id: "",
    //   name: "",
    //   balance: 0,
    // })
  };
  const handleBankDeposite = async(id:string,amount:string)=>{
    try {
      const bank = {
        _id: id,
        deposit: amount,
      };

      const response = await axios.post("/api/bank/addEditBanks", bank);
      console.log("Response", response);
      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);s
    }
  }
  const handleBankWithdraw = async(id:string,amount:string)=>{
    try {
      const bank = {
        _id: id,
        withdraw: amount,
      };

      const response = await axios.post("/api/bank/addEditBanks", bank);
      console.log("Response", response);
      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);s
    }
  }
  const handleDeposit = async () => {
    if (!selectedBank || !amount) return;

    await handleBankDeposite(selectedBank,amount)
    await bankList();


    setShowDeposit(false);
    setAmount("");
  };

  const handleWithdraw = async () => {
    if (!selectedBank || !amount) return;

    await handleBankWithdraw(selectedBank,amount)
    await bankList();

    setShowWithdraw(false);
    setAmount("");
  };

  const handleTransfer = async () => {
    if (!selectedBank || !transferTo || !amount) return;

    await handleBankWithdraw(selectedBank,amount)
    await handleBankDeposite(transferTo,amount)
    await bankList();

    setShowTransfer(false);
    setAmount("");
    setTransferTo("");
  };
  const handleAddCash = async () =>{
    console.log("CashAdd")
  }
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center text-center gap-3">
        <FaArrowLeft onClick={() => router.push("/")} />
        <h1 className="text-3xl font-bold my-auto">Bank Management</h1>
      </div>
      {/* Add Bank Section */}
      <div className="my-6">
        <div className="flex justify-between">
          <button
            onClick={() => setShowAddBank(!showAddBank)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add New Bank
          </button>
          <button
            onClick={() => setShowAddCash(!showAddCash)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add Cash
          </button>
          <div>
          <p className="text-2xl font-bold my-auto">
            Cash Total - ₹{banks.reduce((total, bank) => total + bank.balance, 0)}
          </p>
          <p className="text-2xl font-bold my-auto">
            Bank Total - ₹{banks.reduce((total, bank) => total + bank.balance, 0)}
          </p>

          </div>
        </div>

        {showAddBank && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankDetail.name}
                  onChange={(e) => setBankDetail({ ...bankDetail, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Balance
                </label>
                <input
                  type="number"
                  value={bankDetail.balance}
                  onChange={(e) => setBankDetail({ ...bankDetail, balance: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <button
              onClick={addNewBank}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Bank
            </button>
          </div>
        )}
        {showAddCash && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <div className="bg-white p-6">
            <h3 className="text-xl font-bold mb-4">Add Cash</h3>
            <div className="w-86">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeposit(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCash}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>

          </div>
        )}
      </div>

      {/* Banks List */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {banks.map((bank) => (
          <div key={bank._id} className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{bank.name}</h3>
                <FaEdit onClick={()=>{handleEdit(bank._id)}}/>
              </div>
              <span className="text-xl font-bold">₹{bank.balance}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {" "}
              {/* Changed to grid layout */}
              <button
                onClick={() => {
                  setSelectedBank(bank._id);
                  setShowDeposit(true);
                }}
                className="bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1 justify-center text-sm truncate"
              >
                <FaMoneyBillAlt className="shrink-0" />
                <span className="truncate">Deposit</span>
              </button>
              <button
                onClick={() => {
                  setSelectedBank(bank._id);
                  setShowWithdraw(true);
                }}
                className="bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1 justify-center text-sm truncate"
              >
                <FaMoneyBillWave className="shrink-0" />
                <span className="truncate">Withdraw</span>
              </button>
              <button
                onClick={() => {
                  setSelectedBank(bank._id);
                  setShowTransfer(true);
                }}
                className="bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1 justify-center text-sm truncate"
              >
                <FaExchangeAlt className="shrink-0" />
                <span className="truncate">Transfer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Deposit Cash</h3>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeposit(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Withdraw Cash</h3>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowWithdraw(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Transfer Funds</h3>
            <select
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className="w-full p-2 border rounded mb-4"
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
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTransfer(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
