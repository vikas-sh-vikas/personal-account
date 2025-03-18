// components/EditableTransactionItem.tsx
"use client";
import { useEffect, useState } from "react";
import { Bank, Transaction } from "../types/types";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function EditableTransactionItem({
  transaction: initialTransaction,
  onUpdate,
}: {
  transaction: Transaction;
  onUpdate: (id: string) => void;
}) {
  return (
    <div className={`p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span
                className={`font-medium ${
                  initialTransaction.type === "credit"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                ₹{initialTransaction.amount}
              </span>
              <span className="text-sm text-gray-600">
                {initialTransaction.description}
              </span>
              <span className="text-sm text-gray-500">
                {initialTransaction.category}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(initialTransaction.date).toLocaleDateString()}
            </div>
          </div>
        {/* </div> */}
          <button
            onClick={() => onUpdate(initialTransaction._id ?? "")}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <FaEdit />
          </button>
        </div>
        </div>
  );
}
