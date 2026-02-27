import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Grocery Tracker</h1>
        <p className="text-zinc-600 mb-8">
          Manage groceries and split costs with your roommates
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Grocery List</CardTitle>
              <CardDescription>Add items you need</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/list">
                <Button className="w-full cursor-pointer">View List</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchases</CardTitle>
              <CardDescription>Log shopping trips</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/purchases">
                <Button className="w-full cursor-pointer">Add Purchase</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Breakdown</CardTitle>
              <CardDescription>Monthly stats & settlements</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/breakdown">
                <Button className="w-full cursor-pointer">
                  View Breakdown
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
