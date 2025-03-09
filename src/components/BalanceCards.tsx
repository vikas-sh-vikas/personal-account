export default function BalanceCards({
  totalCredits,
  totalDebits,
  netWorth,
}: {
  totalCredits: number;
  totalDebits: number;
  netWorth: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
        <p className="text-2xl font-bold text-green-600">
          ₹{totalCredits}
        </p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600">
          ₹{totalDebits}
        </p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Net Worth</h3>
        <p className="text-2xl font-bold text-gray-800">
          ₹{netWorth}
        </p>
      </div>
    </div>
  );
}
