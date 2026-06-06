import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "#components/ui/label";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import type { Bill, Recurrence } from "../types";


type BillFormProps = {
  title: string;
  path: string;
  reqMethod: string;
  initialBill?: Partial<Bill>;
}


export default function BillForm({
  title,
  path,
  reqMethod,
  initialBill,
}: BillFormProps) {
  const [name, setName] = useState(initialBill?.name ?? "");
  const [recurrence, setRecurrence] = useState<Recurrence | "">(
    initialBill?.recurrence ?? ""
  );
  const [amount, setAmount] = useState(
    initialBill?.amount ? Number(initialBill.amount) : undefined
  );
  const [dueDate, setDueDate] = useState(initialBill?.dueDate);
  const [dueDayOfMonth, setDueDayOfMonth] = useState(initialBill?.dueDayOfMonth);
  const [dueMonth, setDueMonth] = useState(initialBill?.dueMonth);
  const [isPaid, setIsPaid] = useState(initialBill?.isPaid);


  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const body: Record<string, unknown> = {
        name,
        recurrence,
        amount,
        isPaid
      }
      if (recurrence === "once") {
        body.dueDate = dueDate;
      } else if (recurrence === "monthly") {
        body.dueDayOfMonth = dueDayOfMonth;
      } else if (recurrence === "yearly") {
        body.dueDayOfMonth = dueDayOfMonth;
        body.dueMonth = dueMonth;
      }
      const response = await fetch(path, {
        method: reqMethod,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Request failed");
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>
              <Label>Bill Name</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <br />
            <div>
              <Label>Amount</Label>
              <Input type="number" value={amount ?? ""}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)} 
              />
            </div>
            <br />
            <div>
              <select value={recurrence} onChange={(e) =>   
                setRecurrence(e.target.value as Recurrence)}>
                <option value="">Select recurrence</option>
                <option value="once">Once</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>   
            <br />     

            { recurrence === "once" && 
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            }    
            { recurrence === "monthly" && 
              <div>
                <Label>Due Day</Label>
                <Input type="number" value={dueDayOfMonth ?? ""} min={1} max={31}
                  onChange={(e) => setDueDayOfMonth(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            }               
            { recurrence === "yearly" && 
              <div>
                <Label>Due Day</Label>
                <Input type="number" value={dueDayOfMonth ?? ""} min={1} max={31}
                  onChange={(e) => setDueDayOfMonth(e.target.value ? Number(e.target.value) : undefined)}
                />
                <Label>Due Month</Label>
                <Input type="number" value={dueMonth ?? ""} min={1} max={12}
                  onChange={(e) => setDueMonth(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            }    

            {/* Show only when editing bill */}
            {isPaid !== undefined && (
              <select value={isPaid ? "true" : "false"} onChange={(e) => setIsPaid(e.target.value === "true")}>
                <option value="false">Unpaid</option>
                <option value="true">Paid</option>
              </select>
            )}
            <br />
            <Button type="submit">Submit</Button>
            {error && <p>{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  ); 
}
