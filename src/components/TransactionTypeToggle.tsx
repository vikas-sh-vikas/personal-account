import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function TransactionTypeToggle({
  type,
  onTypeChange,
}: {
  type: "credit" | "debit";
  onTypeChange: (type: "credit" | "debit") => void;
}) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        onClick={() => onTypeChange("debit")}
        className={`px-4 py-2 rounded-lg ${
          type === "debit"
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        <FaArrowDown className="inline mr-2" /> Expense
      </button>
      <button
        onClick={() => onTypeChange("credit")}
        className={`px-4 py-2 rounded-lg ${
          type === "credit"
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        <FaArrowUp className="inline mr-2" /> Income
      </button>
    </div>
  );
}
