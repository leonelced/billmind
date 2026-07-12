import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { type BillDetails } from "../types";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import BillForm from "#components/BillForm";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDueDate } from "../utils/format";
import { useApiRequest } from "#hooks/useApiRequest";
import { API } from "../utils/api";


export default function Bill() { 
  const { run, loading, error } = useApiRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [bill, setBill] = useState<BillDetails>();
  const { id } = useParams();
  if (!id) return;
  const billPath = API.bills.details(id);
  // New member to add:
  const [newMemberEmail, setNewMemberEmail] = useState("");
  // New reminder rule to add: (remind me this amount of days before the due date)
  const [daysBeforeDue, setDaysBeforeDue] = useState<number | undefined>(undefined);
  const navigate = useNavigate();


  // Same fetchBill function between renders unless `path` changes
  const fetchBill = useCallback(async () =>  {
    const { data } = await run<BillDetails>(billPath, { method: "GET" });
    if (data) setBill(data);
  }, [run, billPath]);


  useEffect(() => {
    fetchBill();
  }, [fetchBill]); // re-run this effect when fetchBill changes


  async function handleAddMember(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const billId = bill?.bill.id;
    if (!billId) return;
    const memberPath = `/api/bills/${billId}/members`;
    const { data } = await run(memberPath, { 
      method: "POST", 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newMemberEmail }) 
    });
    if (data) {
      await fetchBill();
      setNewMemberEmail("");
    }
  }


  async function handleAddRule(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const billId = bill?.bill.id;
    if (!billId) return;
    const reminderPath = `/api/bills/${billId}/reminders`;
    const { data } = await run(reminderPath, { 
      method: "POST", 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({daysBeforeDue}) 
    });
    if (data) {
      await fetchBill();
      setDaysBeforeDue(undefined);
    }
  }


  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    const billId = bill?.bill.id;
    if (!billId) return;
    const deletePath = `/api/bills/${billId}`;
    const { success } = await run(deletePath, { method: "DELETE" });
    if (success) navigate("/dashboard");
  }


  return (
    <div>      
      { !bill && loading && <p>Loading</p>}
      { error && <p>{error}</p> }
      { bill &&
      <div className="flex gap-4">
        <Card className="max-w-sm shrink-0">
          <CardHeader>
            <CardTitle>{bill?.bill.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatCurrency(bill.bill.amount)}</p>
            <p>{formatDueDate(bill.bill)}</p>
            <div className="flex gap-2 mt-2">
              <Badge>{bill.bill.recurrence}</Badge>
              <Badge variant={bill.bill.isPaid ? "default" : "destructive"}>
                {bill.bill.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
            <br />
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>     
            {isEditing && (
              <BillForm
                path={billPath}
                reqMethod="PUT"
                title="Update Bill"
                initialBill={{
                  name: bill.bill.name,
                  recurrence: bill.bill.recurrence,
                  amount: bill.bill.amount ? bill.bill.amount : undefined,
                  dueDate: bill.bill.dueDate
                    ? bill.bill.dueDate.split("T")[0]
                    : undefined,
                  dueDayOfMonth: bill.bill.dueDayOfMonth ? bill.bill.dueDayOfMonth : undefined,
                  dueMonth: bill.bill.dueMonth ? bill.bill.dueMonth : undefined,
                  isPaid: bill.bill.isPaid,
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="max-w-sm shrink-0">
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            {bill.members.map(member => (
              <div key={member.userId}>
                <Badge variant={"secondary"}>{member.userName}</Badge>
                <Badge variant={"outline"}>{member.email}</Badge>
              </div>
            ))}
            <form onSubmit={handleAddMember}>
              <Input 
                id="member-email"
                aria-label="Add member email"
                type="email" 
                value={newMemberEmail} 
                onChange={(e) => setNewMemberEmail(e.target.value)} 
                placeholder="example@email.com" 
              />
              <Button type="submit">Add Member</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="max-w-sm shrink-0">
          <CardHeader>
            <CardTitle>Reminder Days Before Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mt-2">
              {bill.rules.map(rule => (
                <div key={rule.id}>
                  <Badge>{rule.daysBeforeDue}</Badge>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddRule}>
              <Input 
                id="rule-days"
                aria-label="Days before due"
                type="number" 
                min={0} 
                value={daysBeforeDue ?? ""} 
                onChange={(e) => setDaysBeforeDue(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )} 
              />
              <Button type="submit">Add Day</Button>
            </form>
          </CardContent>
        </Card>
        <Button onClick={handleDelete} variant="destructive">Delete</Button>
      </div>
      }
    </div>
  ); 
}
