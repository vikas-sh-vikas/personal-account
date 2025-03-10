import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Cash from "@/models/cashModel";

connect();
export async function GET(request: NextRequest) {
  try {
    const cash = await Cash.find().limit(1);
    // console.log("Customers", player);
    return NextResponse.json({
      message: "cash Found",
      data: cash,
    });
  } catch (error: any) {
    // console.log("reachGetData")
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
