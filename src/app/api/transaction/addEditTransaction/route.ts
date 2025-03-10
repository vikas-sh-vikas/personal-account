import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
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
    //add customer
    if (reqBody._id) {
      console.log(reqBody._id);
      const transaction = await Transaction.findOneAndUpdate(
        {
          _id: reqBody._id,
        },
        {
          ...reqBody,
        }
      );

      // console.log("Customer",item)

      return NextResponse.json({
        message: "Transaction Updated",
        success: true,
      });
    } else {
      const transaction = await Transaction.create({
        _id,
        type,
        amount,
        category_id,
        payment_method,
        bank_id,
        date,
        description,
      });
      return NextResponse.json({
        message: "Transaction saved",
        success: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
