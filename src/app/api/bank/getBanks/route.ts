import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bank from "@/models/bankModel";

connect();
export async function GET(request: NextRequest) {
  try {
    const bank = await Bank.find();
    // console.log("Customers", player);
    return NextResponse.json({
      message: "Bank Found",
      data: bank,
    });
  } catch (error: any) {
    // console.log("reachGetData")
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
