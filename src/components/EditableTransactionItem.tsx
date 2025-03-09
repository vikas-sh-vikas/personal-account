// components/EditableTransactionItem.tsx
'use client';
import { useState } from 'react';
import { Transaction } from '../types/types';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function EditableTransactionItem({
  transaction: initialTransaction,
  onUpdate
}: {
  transaction: Transaction;
  onUpdate: (transaction: Transaction) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(initialTransaction);

  const handleSave = () => {
    onUpdate(editedTransaction);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTransaction(initialTransaction);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  return (
    <div className={`p-4 ${isEditing ? 'bg-blue-50' : ''}`}>
      {!isEditing ? (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span className={`font-medium ${
                initialTransaction.type === 'credit' ? 'text-green-700' : 'text-red-700'
              }`}>
                ₹{initialTransaction.amount}
              </span>
              <span className="text-sm text-gray-600">{initialTransaction.description}</span>
              <span className="text-sm text-gray-500">{initialTransaction.category}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(initialTransaction.date).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <FaEdit />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={editedTransaction.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={editedTransaction.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={editedTransaction.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={editedTransaction.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {editedTransaction.type === 'credit' ? (
                  <>
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investment</option>
                  </>
                ) : (
                  <>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="shopping">Shopping</option>
                    <option value="grocery">Grocery</option>
                  </>
                )}
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaSave />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}