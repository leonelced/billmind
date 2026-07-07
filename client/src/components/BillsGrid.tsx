import type { Bill } from "../types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import { formatDueDate } from "../utils/format.js";

export function BillsGrid(
  {bills, loading, error}: {
    bills: Bill[],
    loading: boolean,
    error: string
  }
) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      { loading && <p>Loading...</p>}
      { error && <p>{error}</p> }
      {!loading && !error && bills.map((bill) => (
        <div key={bill.id}>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>
                <Link to={`/bills/${bill.id}`}>
                  <p>{bill.name}</p>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{bill.amount ? `$${bill.amount}` : "Unknown"}</p>
              <p>{formatDueDate(bill)}</p>
              <Badge>{bill.recurrence}</Badge>
              <Badge variant={bill.isPaid ? "default" : "destructive"}>
                {bill.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  ); 
}