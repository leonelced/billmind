import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "#components/ui/label";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { RECURRENCE, type Bill, type Recurrence } from "../types";
import { useApiRequest } from "#hooks/useApiRequest";


type BillFormProps = {
  title: string;
  path: string;
  reqMethod: "POST" | "PUT";
  initialBill?: Partial<Bill>;
}


export default function BillForm({
  title,
  path,
  reqMethod,
  initialBill,
}: BillFormProps) {
  const { run, error } = useApiRequest();
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
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = {
      name, recurrence, amount, isPaid
    }
    if (recurrence === RECURRENCE.ONCE) {
      body.dueDate = dueDate;
    } else if (recurrence === RECURRENCE.MONTHLY) {
      body.dueDayOfMonth = dueDayOfMonth;
    } else if (recurrence === RECURRENCE.YEARLY) {
      body.dueDayOfMonth = dueDayOfMonth;
      body.dueMonth = dueMonth;
    }
    const { success } = await run<Bill[]>(path, { 
      method: reqMethod, 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body) 
    });
    if (success) navigate("/dashboard");
  }
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>
              <Label htmlFor="bill-name">Bill Name</Label>
              <Input 
                id="bill-name" 
                name="name" 
                autoComplete="off"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <br />
            <div>
              <Label htmlFor="bill-amount">Amount</Label>
              <Input 
                id="bill-amount" 
                name="amount"
                type="number" 
                value={amount ?? ""}
                onChange={
                  (e) => setAmount(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                } 
              />
            </div>
            <br />
            <div>
              <select 
                id="bill-recurrence" 
                name="recurrence"
                aria-label="Recurrence" 
                value={recurrence} 
                onChange={
                  (e) => setRecurrence(e.target.value as Recurrence)
                }
              >
                <option value="">Select recurrence</option>
                <option value={RECURRENCE.ONCE}>Once</option>
                <option value={RECURRENCE.MONTHLY}>Monthly</option>
                <option value={RECURRENCE.YEARLY}>Yearly</option>
              </select>
            </div>   
            <br />     

            { recurrence === RECURRENCE.ONCE && 
              <div>
                <Label htmlFor="bill-due-date">Due Date</Label>
                <Input 
                  id="bill-due-date" 
                  name="due-date"
                  type="date" 
                  value={dueDate ?? ""} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>
            }    
            { recurrence === RECURRENCE.MONTHLY && 
              <div>
                <Label htmlFor="bill-due-day">Due Day</Label>
                <Input 
                  id="bill-due-day" 
                  name="due-day"
                  type="number" 
                  value={dueDayOfMonth ?? ""} 
                  min={1} 
                  max={31}
                  onChange={
                    (e) => setDueDayOfMonth(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            }               
            { recurrence === RECURRENCE.YEARLY && 
              <div>
                <Label htmlFor="bill-due-day">Due Day</Label>
                <Input 
                  id="bill-due-day" 
                  name="due-day"
                  type="number" 
                  value={dueDayOfMonth ?? ""} 
                  min={1} 
                  max={31}
                  onChange={
                    (e) => setDueDayOfMonth(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <Label htmlFor="bill-due-month">Due Month</Label>
                <Input 
                  id="bill-due-month" 
                  name="due-month"
                  type="number" 
                  value={dueMonth ?? ""} 
                  min={1} 
                  max={12}
                  onChange={
                    (e) => setDueMonth(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            }    

            {/* Show only when editing bill */}
            {isPaid !== undefined && (
              <select 
                id="bill-is-paid" 
                name="isPaid"
                aria-label="Is Paid?" 
                value={isPaid ? "true" : "false"} 
                onChange={(e) => setIsPaid(e.target.value === "true")}
              >
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
