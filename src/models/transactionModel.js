import mongoose from "mongoose";
import Bank from "./bankModel";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please provide type"],
    // unique: true,
  },
  amount: {
    type: String,
    required: [true, "Please provide amount"],
    // unique: true,
  },
  category_id: {
    type: Number,
    required: [true, "Please provide a category"],
    // unique: true,
  },
  payment_method: {
    type: String,
    required: [true, "Please provide a payment method"],
    // unique: true,
  },
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Bank,
    required: false,
    default: null,
    set: (value) => (value === "" ? null : value), // Convert empty string to null
  },
  date: {
    type: Date,
    required: [true, "Please provide date"],
    // unique: true,
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
    // unique: true,
  },
},
{ timestamps: true }
);
const Transaction =
  mongoose.models.transactions ||
  mongoose.model("transactions", transactionSchema);

export default Transaction;
