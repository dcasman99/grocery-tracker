import { NextRequest, NextResponse } from "next/server";
import { getPurchases, addPurchase } from "@/lib/db";

export async function GET() {
  const purchases = await getPurchases();
  return NextResponse.json(purchases);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPurchase = await addPurchase({
    ...body,
    date: new Date(body.date),
  });
  return NextResponse.json(newPurchase);
}
