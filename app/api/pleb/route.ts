import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  return { req, res };
}
