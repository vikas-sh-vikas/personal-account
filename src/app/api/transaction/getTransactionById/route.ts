import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("object", reqBody);
    const transaction = await Transaction.findOne({ _id: reqBody.id });

    if (!transaction) {
      return NextResponse.json({
        message: "Transaction Not Found",
        data: transaction,
      });
    }
    return NextResponse.json({
      message: "Transaction Found",
      data: transaction,
    });
  } catch (error: any) {
    // console.log("reachGetData")
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
