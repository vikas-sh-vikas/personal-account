import { connect } from "@/dbConfig/dbConfig";
import Bank from "@/models/bankModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, name, balance, address,deposit,withdraw } = reqBody;
    //add customer
    if (_id) {
      // Find the existing bank entry
      const existingBank = await Bank.findById(_id);
      if (!existingBank) {
        return NextResponse.json({ message: "Bank not found", success: false }, { status: 404 });
      }

      // Convert deposit to a number and add to balance if deposit is provided
      if(deposit){
        const currentBalance = parseFloat(existingBank.balance) || 0;
        const depositAmount = deposit ? parseFloat(deposit) : 0;
        const updatedBalance = (currentBalance + depositAmount).toFixed(2); // Keep 2 decimal places
        await Bank.findByIdAndUpdate(
          _id,
          {
            name,
            balance: updatedBalance.toString(), // Convert back to string
            address,
          },
          { new: true }
        );
        
      }
      else if(withdraw){
        const currentBalance = parseFloat(existingBank.balance) || 0;
        const withdrawAmount = withdraw ? parseFloat(withdraw) : 0;
        const updatedBalance = (currentBalance - withdrawAmount).toFixed(2); // Keep 2 decimal places
        await Bank.findByIdAndUpdate(
          _id,
          {
            name,
            balance: updatedBalance.toString(), // Convert back to string
            address,
          },
          { new: true }
        );
        
      }
      else{
        await Bank.findByIdAndUpdate(
          _id,
          {
            name,
            balance,
            address,
          },
          { new: true }
        );
      }

      return NextResponse.json({
        message: "Bank Updated",
        success: true,
      });
    } else {
      const bank = await Bank.create({
        name,
        balance,
        address,
      });
      return NextResponse.json({
        message: "Bank saved",
        success: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
