import axios from "axios";
import { useEffect, useState } from "react";

export default function BalanceCards({
}: {
}) {
  const [bankTotal, setBankAmount] = useState(0)
  const [cash, setCash] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const [totalDebits, setTotalDebits] = useState(0)
  const [transactions,setTransactions] =useState([{
    type:"",
    amount:"",
  }])
  useEffect(()=>{
    getBankTotal()
    getCashTotal()
    getTransaction()
  },[])

  const getTransaction = async () =>{
    try {
      const response = await axios.get("/api/transaction/getTransaction");

      const apiData = response.data.data;

      const banksWithParsedBalance = await apiData.map((transaction: any) => ({
        _id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
      }));
      setTotalCredits(banksWithParsedBalance
        .filter((t:any) => t.type === "credit")
        .reduce((sum:any, t:any) => sum + parseFloat(t.amount), 0))
      setTotalDebits(banksWithParsedBalance
        .filter((t:any) => t.type === "debit")
        .reduce((sum:any, t:any) => sum + parseFloat(t.amount), 0))
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
  }

  const getBankTotal = async ()=> {
    try {
      const response = await axios.get("/api/bank/totalBankBalace");

      const apiData = response.data;
      // const banksWithParsedBalance = await apiData.map((bank: any) => ({
      //   ...bank,
      //   balance: parseFloat(bank.balance),
      // }));
      console.log("apiData",apiData)
      setBankAmount(parseFloat(apiData.totalBalance))
      // setBanks(apiData);

      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }
  }
  const getCashTotal = async ()=> {
    try {
      const response = await axios.get("/api/cash/getCash");

      const apiData = response.data.data[0];
      // const banksWithParsedBalance = await apiData.map((bank: any) => ({
      //   ...bank,
      //   balance: parseFloat(bank.balance),
      // }));
      console.log("apiData",apiData)
      setCash(parseFloat(apiData.amount))
      // setBankAmount(apiData.totalBalance)
      // setBanks(apiData);

      // setSuccess("Player added successfully!");
      // setTeam({ name: "", shortCode: "" }); // reset form
    } catch (err) {
      console.error(err);
      // setError("Failed to add player. Please try again.");
    } finally {
      // setLoading(false);
    }
  }
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Income (this month)</h3>
        <p className="text-2xl font-bold text-green-600">
          ₹{totalCredits}
        </p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Expenses (this month)</h3>
        <p className="text-2xl font-bold text-red-600">
          ₹{totalDebits}
        </p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Balnce</h3>
        <p className="text-2xl font-bold text-gray-800">
        ₹{bankTotal + cash}
        </p>
        {/* <p className="text-2xl font-bold text-gray-800">
        {cash}
        </p> */}
      </div>
    </div>
  );
}
