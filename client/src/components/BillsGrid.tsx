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
  function getTotal() {
    const total = bills.reduce((total, bill) => {
      return bill.amount ? total + parseFloat(bill.amount) : total;
    }, 0);
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  }
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        { loading && <p>Loading...</p>}
        { error && <p>{error}</p> }
        {!loading && !error && bills.map((bill) => (
          <Card key={bill.id} className="w-full max-w-sm">
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
        ))}
      </div>
      {!loading && !error && bills.length > 1 && (
        <Card className="bg-muted/50">
          <CardContent className="flex items-center justify-between py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total across {bills.length} bills
            </span>
            <span className="text-2xl font-bold tracking-tight">
              {getTotal()}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  ); 
}