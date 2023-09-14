"use client";
import React, { useState } from "react";
import { trpc } from "../_trpc/client";

export default function Pleb() {
  const [amount, setAmount] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const getStkKit = trpc.stkPush.useMutation();
  async function handleClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (amount?.length && phoneNumber?.length) {
      getStkKit.mutate({
        amount: amount,
        phoneNumber: phoneNumber,
      });
    }
  }

  return (
    <form onSubmit={handleClick}>
      <h1>enter phone number</h1>
      <input
        type="text"
        placeholder="enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <h1> enter amount</h1>
      <input
        type="text"
        placeholder="enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit" className="block border">
        pleb
      </button>
    </form>
  );
}
