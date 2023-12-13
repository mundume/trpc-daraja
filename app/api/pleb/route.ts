import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultCode = body.Body.stkCallback.ResultCode;
    if (resultCode !== 0) {
      console.log(body);
      return NextResponse.json(body);
    }
    console.log(body);

    //save the data to a db or persist it to local storage
    return NextResponse.json(body);
  } catch (error) {
    throw new Error(error as string);
  }
}
