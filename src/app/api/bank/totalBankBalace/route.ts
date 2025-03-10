import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bank from "@/models/bankModel";

connect();

export async function GET(request: NextRequest) {
  try {
    const banks = await Bank.find();
    const totalBalance = banks.reduce((total, bank) => total + parseFloat(bank.balance), 0);

    return NextResponse.json({
      message: "Bank Found",
      // data: banks,
      totalBalance,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
