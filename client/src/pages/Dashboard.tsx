import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import { formatDueDate } from "../utils/format.js";
import { apiFetch } from "../utils/auth.js";


export default function Dashboard() { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const url: string = "/api/bills/";

  // this runs once when the component first renders
  useEffect(() => {
    async function fetchBills() {
      try {
        const response = await apiFetch(url, { method: "GET" });
        if (!response.ok) {
          throw new Error("Request failed");          
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []); // the [] means "only run once on mount"

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
