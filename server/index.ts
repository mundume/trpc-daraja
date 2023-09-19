import { publicProcedure, router } from "./trpc";
import { string, z } from "zod";

type MpesaApiResponseToken = {
  access_token: string;
  expires_in: string;
};

type MpesaStkRequestBody = {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: "CustomerBuyGoodsOnline" | "CustomerPayBillOnline";
  Amount: string;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
};

function generateTimestamp() {
  const date = new Date();
  const timestamp = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  return timestamp;
}

export const appRouter = router({
  getTodos: publicProcedure.query(async (ctx) => {
    const consumerKey = process.env.CONSUMER_KEY!;
    const consumerSecret = process.env.CONSUMER_SECRET!;
    const url = process.env.GENERATETOKENURL!;

    const encodedCredentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    if (response.ok) {
      const res = await response.json();
      return res as MpesaApiResponseToken;
    }
  }),
  stkPush: publicProcedure
    .input(z.object({ amount: z.string(), phoneNumber: z.string() }))
    .mutation(async ({ input }) => {
      const url = process.env.STKPUSHURL!;
      const reciverNumber = process.env.PHONENUMBER!;
      const passkey = process.env.PASSKEY!;
      const shortcode = process.env.SHORTCODE!;
      const caller = appRouter.createCaller({});
      const token = await caller.getTodos();
      const timestamp = generateTimestamp();
      const stk_password = Buffer.from(
        `${shortcode}${passkey}${timestamp}`
      ).toString("base64");
      console.log(stk_password);

      const requestBody: MpesaStkRequestBody = {
        BusinessShortCode: shortcode,
        Password: stk_password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: input.amount,
        PartyA: input.phoneNumber,
        PartyB: shortcode,
        PhoneNumber: reciverNumber,
        CallBackURL: "https://trpc-daraja.vercel.app/api/stkPush",
        AccountReference: "account",
        TransactionDesc: "test",
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        console.log(response.statusText);
        console.log(response.json());

        return Response.json("An error occurred", {
          status: response.status,
        });
      }
      if (response.ok) {
        console.log(`hurray pleber ${response.statusText}`);
      }
    }),
  stkPushCallback: publicProcedure.mutation(async ({ ctx }) => {
    console.log(ctx);
    return Response.json("success", {
      status: 200,
    });
  }),
});

export type AppRouter = typeof appRouter;
