import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { type BillDetails } from "../types";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import BillForm from "#components/BillForm";
import { useNavigate } from "react-router-dom";
import { formatDueDate } from "../utils/format";


export default function Bill() { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [bill, setBill] = useState<BillDetails>();
  const { id } = useParams();
  const path = `/api/bills/${id}`;
  // New member to add:
  const [userId, setUserId] = useState("");
  // New reminder rule to add: (remind me this amount of days before the due date)
  const [daysBeforeDue, setDaysBeforeDue] = useState<number | undefined>(undefined);
  const navigate = useNavigate();


  // Same fetchBill function between renders unless `path` changes
  const fetchBill = useCallback(async () =>  {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(path, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setBill(data);
    } catch (err) {
      setError("Something went wrong fetching the bill");
    } finally {
      setLoading(false);
    }
  }, [path]);


  useEffect(() => {
    fetchBill();
  }, [fetchBill]); // re-run this effect when fetchBill changes


  async function handleAddMember(e: React.SubmitEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const billId = bill?.bill.id;
    const memberPath = `/api/bills/${billId}/members`;
    if (!billId) return;
    try {
      const response = await fetch(memberPath, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({userId})
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      await fetchBill();
      setUserId("");
    }
  }


  async function handleAddRule(e: React.SubmitEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const billId = bill?.bill.id;
    const reminderPath = `/api/bills/${billId}/reminders`;
    try {
      const response = await fetch(reminderPath, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({daysBeforeDue})
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      await fetchBill();
      setDaysBeforeDue(undefined);
    }
  }


  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    const token = localStorage.getItem("token");
    const billId = bill?.bill.id;
    const deletePath = `/api/bills/${billId}`;
    try {
      const response = await fetch(deletePath, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to delete");
      navigate("/dashboard");
    } catch (err) {
      setError("Could not delete bill")
    }
  }


  return (
    <div>      
      { loading && <p>Loading</p>}
      { error && <p>{error}</p> }
      { !loading && !error && bill &&
      <div className="flex gap-4">
        <Card className="max-w-sm shrink-0">
          <CardHeader>
            <CardTitle>{bill?.bill.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{bill.bill.amount ? `$${bill.bill.amount}` : "Unknown"}</p>
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
                path={path}
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
              <Input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <Button type="submit">Add Member</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="max-w-sm shrink-0">
          <CardHeader>
            <CardTitle>Rules</CardTitle>
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
                type="number" 
                min={0} 
                value={daysBeforeDue ?? ""} 
                onChange={(e) => setDaysBeforeDue(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )} 
              />
              <Button type="submit">Add Rule</Button>
            </form>
          </CardContent>
        </Card>
        <Button onClick={handleDelete} variant="destructive">Delete</Button>
      </div>
      }
    </div>
  ); 
}
