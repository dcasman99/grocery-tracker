import { NextRequest, NextResponse } from "next/server";
import { getPurchasesByMonth } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || "");
  const month = parseInt(searchParams.get("month") || "");

  if (!year || !month) {
    return NextResponse.json(
      { error: "year and month are required" },
      { status: 400 },
    );
  }

  const purchases = await getPurchasesByMonth(year, month);
  return NextResponse.json(purchases);
}
