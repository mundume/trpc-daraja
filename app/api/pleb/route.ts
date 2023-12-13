import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultCode = body.Body.stkCallback.ResultCode;
    if (resultCode !== 0) {
      console.log(body);
      return new NextResponse("Request cancelled by the user", {
        status: 200,
      });
    }
    console.log(body);

    //save the data to a db or persist it to local storage
    const getAmount = body.Item.find((obj: any) => obj.Name === "Amount");
    const amount = getAmount.Value;

    const getCode = body.Item.find(
      (obj: any) => obj.Name === "MpesaReceiptNumber"
    );
    const mpesaCode = getCode.Value;

    const getPhoneNumber = body.Item.find(
      (obj: any) => obj.Name === "PhoneNumber"
    );
    const phone = getPhoneNumber.Value;
    console.log(amount, mpesaCode, phone);
    return new NextResponse("success", {
      status: 200,
    });
  } catch (error) {
    throw new Error(error as string);
  }
}
