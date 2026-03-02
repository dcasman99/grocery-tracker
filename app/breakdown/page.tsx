"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Purchase, Roommate } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function BreakdownPage() {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    fetch("/api/roommates")
      .then((r) => r.json())
      .then(setRoommates);
    fetch("/api/purchases")
      .then((r) => r.json())
      .then(setPurchases);
  }, []);

  const stats = useMemo(() => {
    setLoadingStats(true);
    const [year, month] = selectedMonth.split("-").map(Number);

    const filtered = purchases.filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const byRoommate = roommates.map((roommate) => {
      const userPurchases = filtered.filter(
        (p) => p.roommateId === roommate.id,
      );
      return {
        id: roommate.id,
        name: roommate.name,
        trips: userPurchases.length,
        spent: userPurchases.reduce((sum, p) => sum + p.amount, 0),
      };
    });

    const total = byRoommate.reduce((sum, r) => sum + r.spent, 0);
    const perPerson = total / 3;

    const settlements = byRoommate.map((r) => ({
      ...r,
      balance: r.spent - perPerson,
    }));

    setLoadingStats(false);
    return { byRoommate, total, perPerson, settlements };
  }, [selectedMonth, purchases, roommates]);

  const getSettlementText = () => {
    const sorted = [...stats.settlements].sort((a, b) => a.balance - b.balance);
    const owes = sorted.filter((s) => s.balance < 0);
    const owed = sorted.filter((s) => s.balance > 0);

    if (owes.length === 0) return ["Everyone is settled up!"];

    const messages: string[] = [];
    owes.forEach((debtor) => {
      owed.forEach((creditor) => {
        if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
          const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
          messages.push(
            `${debtor.name} owes ${creditor.name} $${amount.toFixed(2)}`,
          );
          debtor.balance += amount;
          creditor.balance -= amount;
        }
      });
    });

    return messages.length > 0 ? messages : ["Everyone is settled up!"];
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Monthly Breakdown</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Month</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded"
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roommate</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              {loadingStats ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {stats.byRoommate.map((r) => {
                    const balance = r.spent - stats.perPerson;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.trips}</TableCell>
                        <TableCell>${r.spent.toFixed(2)}</TableCell>
                        <TableCell
                          className={
                            balance > 0
                              ? "text-green-600"
                              : balance < 0
                                ? "text-red-600"
                                : ""
                          }
                        >
                          {balance > 0 ? "+" : ""}
                          {balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell>
                      {stats.byRoommate.reduce((sum, r) => sum + r.trips, 0)}
                    </TableCell>
                    <TableCell>${stats.total.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <p className="text-sm text-zinc-600 mt-4">
              Fair share per person: ${stats.perPerson.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getSettlementText().map((text, i) => (
                <p key={i} className="p-3 bg-zinc-50 rounded">
                  {text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
