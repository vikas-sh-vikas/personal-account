import { connect } from "@/dbConfig/dbConfig";
import Bank from "@/models/bankModel";
import Cash from "@/models/cashModel";
import Transaction from "@/models/transactionModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a database transaction

  try {
    const reqBody = await request.json();
    const {
      _id,
      type,
      amount,
      category_id,
      payment_method,
      bank_id,
      date,
      description,
    } = reqBody;

    // Update existing transaction
    if (_id) {
      console.log(_id);
      const transaction = await Transaction.findOne({ _id }).session(session);
      const oldAmount = transaction.amount;
      await Transaction.findOneAndUpdate(
        { _id },
        { ...reqBody },
        { session }
      );
      if(type === "debit"){
        if (payment_method === "cash") {
          const cashAccount = await Cash.findOne().session(session);
          if (!cashAccount) {
            throw new Error("Cash account not found");
          }
          if(parseFloat(cashAccount.amount) < parseFloat(amount)){
            throw new Error("Cash account can not be negative");
          }
  
          cashAccount.amount =  parseFloat(cashAccount.amount) + parseFloat(oldAmount) - parseFloat(amount) ; // Update the cash balance
          await cashAccount.save({ session });
        }
        else if(payment_method == "bank"){
          const bankAmount = await Bank.findOne({ _id: bank_id }).session(session);
          if (!bankAmount) {
            throw new Error("Cash account not found");
          }
          if(parseFloat(bankAmount.amount) < parseFloat(amount)){
            throw new Error("Bank account can not be negative");
          }
          
          bankAmount.balance = parseFloat(bankAmount.balance) + parseFloat(oldAmount) - parseFloat(amount);
          await bankAmount.save({ session });
        }
      }
      else if(type === "credit"){
        if (payment_method === "cash") {
          const cashAccount = await Cash.findOne().session(session);
          if (!cashAccount) {
            throw new Error("Cash account not found");
          }
          if(parseFloat(cashAccount.amount) < parseFloat(amount)){
            throw new Error("Cash account can not be negative");
          }
  
          cashAccount.amount =  parseFloat(cashAccount.amount) - parseFloat(oldAmount) + parseFloat(amount) ; // Update the cash balance
          await cashAccount.save({ session });
        }
        else if(payment_method == "bank"){
          const bankAmount = await Bank.findOne({ _id: bank_id }).session(session);
          if (!bankAmount) {
            throw new Error("Cash account not found");
          }
          if(parseFloat(bankAmount.amount) < parseFloat(amount)){
            throw new Error("Bank account can not be negative");
          }
          
          bankAmount.balance = parseFloat(bankAmount.balance) - parseFloat(oldAmount) + parseFloat(amount);
          await bankAmount.save({ session });
        }
      }
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        message: "Transaction Updated",
        success: true,
      });
    } else {
      // Create a new transaction
      const transaction = await Transaction.create(
        [{ _id, type, amount, category_id, payment_method, bank_id, date, description }],
        { session }
      );
      if(type === "debit"){
              
        // Update Cash balance if payment method is "cash"
if (payment_method === "cash") {
const cashAccount = await Cash.findOne().session(session);
if (!cashAccount) {
throw new Error("Cash account not found");
}
if(parseFloat(cashAccount.amount) < parseFloat(amount)){
throw new Error("Cash account can not be negative");
}

cashAccount.amount =  parseFloat(cashAccount.amount) - parseFloat(amount); // Update the cash balance
await cashAccount.save({ session });
}
else if(payment_method == "bank"){
const bankAmount = await Bank.findOne({ _id: bank_id }).session(session);
if (!bankAmount) {
throw new Error("Cash account not found");
}
if(parseFloat(bankAmount.amount) < parseFloat(amount)){
throw new Error("Bank account can not be negative");
}

bankAmount.balance = parseFloat(bankAmount.balance) - parseFloat(amount)  
await bankAmount.save({ session });


}     
      }
      else if(type === "credit"){
        if (payment_method === "cash") {
          const cashAccount = await Cash.findOne().session(session);
          if (!cashAccount) {
          throw new Error("Cash account not found");
          }
          if(parseFloat(cashAccount.amount) < parseFloat(amount)){
          throw new Error("Cash account can not be negative");
          }
          
          cashAccount.amount =  parseFloat(cashAccount.amount) + parseFloat(amount); // Update the cash balance
          await cashAccount.save({ session });
          }
          else if(payment_method == "bank"){
          const bankAmount = await Bank.findOne({ _id: bank_id }).session(session);
          if (!bankAmount) {
          throw new Error("Cash account not found");
          }
          if(parseFloat(bankAmount.amount) < parseFloat(amount)){
          throw new Error("Bank account can not be negative");
          }
          
          bankAmount.balance = parseFloat(bankAmount.balance) + parseFloat(amount)  
          await bankAmount.save({ session });
          
          } 
      }

      await session.commitTransaction(); // Commit the transaction
      session.endSession();

      return NextResponse.json({
        message: "Transaction saved",
        success: true,
      });
    }
  } catch (error: any) {
    await session.abortTransaction(); // Rollback in case of an error
    session.endSession();

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
