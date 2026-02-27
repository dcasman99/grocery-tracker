import { NextResponse } from "next/server";
import { getRoommates } from "@/lib/db";

export async function GET() {
  const roommates = await getRoommates();
  return NextResponse.json(roommates);
}
