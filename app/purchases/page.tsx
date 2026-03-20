"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GroceryItem, Purchase, Roommate } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchasesPage() {
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [roommateId, setRoommateId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [showItemRemoval, setShowItemRemoval] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetch("/api/roommates")
      .then((r) => r.json())
      .then(setRoommates);
    loadPurchases(true);
    loadGroceryItems();
  }, []);

  const loadPurchases = (reset = false) => {
    setLoadingPurchases(true);
    const currentOffset = reset ? 0 : purchaseList.length;
    fetch(`/api/purchases?limit=${PAGE_SIZE}&offset=${currentOffset}`)
      .then((r) => r.json())
      .then((data: Purchase[]) => {
        setPurchaseList((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
        setLoadingPurchases(false);
      });
  };

  const loadGroceryItems = () => {
    fetch("/api/grocery-items")
      .then((r) => r.json())
      .then(setGroceryItems);
  };

  const handleSubmit = async () => {
    if (roommateId && amount && parseFloat(amount) > 0) {
      const roommate = roommates.find((r) => r.id === roommateId);
      if (roommate) {
        await fetch("/api/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roommateId,
            roommateName: roommate.name,
            amount: parseFloat(amount),
            date: new Date(date),
            notes,
          }),
        });
        loadPurchases(true);

        if (groceryItems.length > 0) {
          setShowItemRemoval(true);
        } else {
          resetForm();
        }
      }
    }
  };

  const handleItemRemoval = async () => {
    for (const id of selectedItems) {
      await fetch(`/api/grocery-items?id=${id}`, { method: "DELETE" });
    }
    loadGroceryItems();
    resetForm();
    setShowItemRemoval(false);
    setSelectedItems([]);
  };

  const resetForm = () => {
    setRoommateId("");
    setAmount("");
    setNotes("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Purchases</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {!showItemRemoval ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Log Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Who shopped?</Label>
                <Select value={roommateId} onValueChange={setRoommateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select roommate" />
                  </SelectTrigger>
                  <SelectContent>
                    {roommates.map((roommate) => (
                      <SelectItem key={roommate.id} value={roommate.id}>
                        {roommate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="e.g., Costco run"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Add Purchase
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Remove Items from List?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-600">Select items you bought:</p>
              <div className="space-y-2">
                {groceryItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4"
                    />
                    <span>
                      {item.item}{" "}
                      <span className="text-sm text-zinc-500">
                        ({item.addedByName})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleItemRemoval} className="flex-1">
                  Remove Selected
                </Button>
                <Button
                  onClick={() => {
                    setShowItemRemoval(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Purchase History ({purchaseList.length})</CardTitle>
          </CardHeader>
          {loadingPurchases && purchaseList.length === 0 ? (
            <CardContent>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
            </CardContent>
          ) : (
            <CardContent>
              {purchaseList.length === 0 ? (
                <p className="text-zinc-500">No purchases logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {purchaseList.map((purchase) => (
                    <div key={purchase.id} className="p-3 bg-zinc-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{purchase.roommateName}</p>
                          <p className="text-sm text-zinc-500">
                            {new Date(purchase.date).toLocaleDateString(
                              "en-US",
                              { timeZone: "UTC" },
                            )}
                            {purchase.notes && ` • ${purchase.notes}`}
                          </p>
                        </div>
                        <p className="font-bold">
                          ${purchase.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {hasMore && (
                    <button
                      onClick={() => loadPurchases()}
                      className="w-full text-sm text-zinc-500 hover:text-zinc-800 py-2 text-center"
                    >
                      {loadingPurchases ? "Loading..." : "Show 10 more"}
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
