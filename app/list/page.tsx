"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GroceryItem, Roommate } from "@/types";

export default function GroceryListPage() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [newItem, setNewItem] = useState("");
  const [selectedRoommate, setSelectedRoommate] = useState("");

  useEffect(() => {
    fetch("/api/roommates")
      .then((r) => r.json())
      .then(setRoommates);
    loadItems();
  }, []);

  const loadItems = () => {
    fetch("/api/grocery-items")
      .then((r) => r.json())
      .then(setItems);
  };

  const handleAdd = async () => {
    if (newItem.trim() && selectedRoommate) {
      const roommate = roommates.find((r) => r.id === selectedRoommate);
      if (roommate) {
        await fetch("/api/grocery-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item: newItem.trim(),
            addedBy: selectedRoommate,
            addedByName: roommate.name,
          }),
        });
        setNewItem("");
        loadItems();
      }
    }
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/grocery-items?id=${id}`, { method: "DELETE" });
    loadItems();
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Grocery List</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:flex gap-4">
              <Input
                className="mb-2 md:mb-0"
                placeholder="Item name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Select
                value={selectedRoommate}
                onValueChange={setSelectedRoommate}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Added by..." />
                </SelectTrigger>
                <SelectContent>
                  {roommates.map((roommate) => (
                    <SelectItem key={roommate.id} value={roommate.id}>
                      {roommate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button className="mt-2 md:mt-0" onClick={handleAdd}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-zinc-500">No items yet. Add some above!</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-zinc-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{item.item}</p>
                      <p className="text-sm text-zinc-500">
                        Added by {item.addedByName}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
