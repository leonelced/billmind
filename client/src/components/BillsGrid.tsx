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
    return bills.reduce((total, bill) => {
      return bill.amount ? total + parseFloat(bill.amount) : total;
    }, 0);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const dashboardPage = ["/dashboard"].includes(location.pathname);

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
              <p>{bill.amount ? `${formatter.format(parseFloat(bill.amount))}` : "Unknown"}</p>
              <p>{formatDueDate(bill)}</p>
              <Badge>{bill.recurrence}</Badge>
              <Badge variant={bill.isPaid ? "default" : "destructive"}>
                {bill.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      {!loading && !error && bills.length > 1 && !dashboardPage && (
        <Card className="bg-muted/50">
          <CardContent className="flex items-center justify-between py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total across {bills.length} bills
            </span>
            <span className="text-2xl font-bold tracking-tight">
              {formatter.format(getTotal())}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  ); 
}