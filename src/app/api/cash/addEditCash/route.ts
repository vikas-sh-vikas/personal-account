import { connect } from "@/dbConfig/dbConfig";
import Cash from "@/models/cashModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, amount,deposit,withdraw } = reqBody;
    //add customer
    if (_id) {
      // Find the existing bank entry
      const existingCash = await Cash.findById(_id);
      if (!existingCash) {
        return NextResponse.json({ message: "Bank not found", success: false }, { status: 404 });
      }

      // Convert deposit to a number and add to balance if deposit is provided
      if(deposit){
        const currentCash = parseFloat(existingCash.amount) || 0;
        const depositCash = deposit ? parseFloat(deposit) : 0;
        const updatedCash = (currentCash + depositCash).toFixed(2); // Keep 2 decimal places
        await Cash.findByIdAndUpdate(
          _id,
          {
            amount: updatedCash.toString(), // Convert back to string
          },
          { new: true }
        );
        
      }
      else if(withdraw){
        const currentCash = parseFloat(existingCash.balance) || 0;
        const withdrawCash = withdraw ? parseFloat(withdraw) : 0;
        const updatedCash = (currentCash - withdrawCash).toFixed(2); // Keep 2 decimal places
        await Cash.findByIdAndUpdate(
          _id,
          {
            amount: updatedCash.toString(), // Convert back to string
          },
          { new: true }
        );
        
      }
      else{
        await Cash.findByIdAndUpdate(
          _id,
          {
            amount,
          },
          { new: true }
        );
      }

      return NextResponse.json({
        message: "Cash Updated",
        success: true,
      });
    } else {
      const cash = await Cash.create({
        amount,
      });
      return NextResponse.json({
        message: "Cash saved",
        success: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
