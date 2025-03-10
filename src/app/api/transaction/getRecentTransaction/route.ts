import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

connect();
export async function GET(request: NextRequest) {
  try {
    const transaction = await Transaction.find().populate('bank_id')
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
    .limit(5); // Limit to 10 results;
    // console.log("Customers", player);
    return NextResponse.json({
      message: "Transaction Found",
      data: transaction,
    });
  } catch (error: any) {
    // console.log("reachGetData")
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
