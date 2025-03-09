import { useRouter } from "next/navigation";
import { FaBuilding } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";

const operationButtons = [
  {
    label: "Reports",
    icon: <FaFileLines style={{ color: "#ffffff" }} />,
    path: "reports",
    bgColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    label: "Banks/Cash",
    icon: <FaBuilding style={{ color: "#ffffff" }} />,
    path: "banks",
    bgColor: "bg-green-600 hover:bg-green-700",
  },
];

export default function OperationButtons() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {operationButtons.map((button, index) => (
        <button
          key={index}
          onClick={() => router.push(`/${button.path}`)}
          className={`${button.bgColor} p-4 rounded-lg flex flex-col items-center justify-center text-white transition-all hover:scale-105`}
        >
          <div className="text-2xl mb-2">{button.icon}</div>
          <span className="text-sm font-medium">{button.label}</span>
        </button>
      ))}
    </div>
  );
}
