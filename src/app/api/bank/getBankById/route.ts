import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bank from "@/models/bankModel";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    // console.log("object", reqBody);
    const bank = await Bank.findOne({ _id: reqBody.id });

    if (!bank) {
      return NextResponse.json({
        message: "Bank Not Found",
        data: bank,
      });
    }
    return NextResponse.json({
      message: "Bank Found",
      data: bank,
    });
  } catch (error: any) {
    // console.log("reachGetData")
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
