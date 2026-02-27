import { NextRequest, NextResponse } from "next/server";
import { getGroceryItems, addGroceryItem, removeGroceryItem } from "@/lib/db";

export async function GET() {
  const items = await getGroceryItems();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newItem = await addGroceryItem(body);
  return NextResponse.json(newItem);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    await removeGroceryItem(id);
  }
  return NextResponse.json({ success: true });
}
