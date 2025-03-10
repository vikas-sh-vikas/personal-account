import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Cash from "@/models/cashModel";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    // console.log("object", reqBody);
    const cash = await Cash.findOne({ _id: reqBody.id });

    if (!cash) {
      return NextResponse.json({
        message: "cash Not Found",
        data: cash,
      });
    }
    return NextResponse.json({
      message: "cash Found",
      data: cash,
    });
  } catch (error: any) {
    // console.log("reachGetData")
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
