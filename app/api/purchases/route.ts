import { NextRequest, NextResponse } from "next/server";
import { getPurchases, addPurchase } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const purchases = await getPurchases(limit, offset);
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
