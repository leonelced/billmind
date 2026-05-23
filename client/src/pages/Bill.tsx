import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { type BillDetails } from "../types";


export default function Bill() { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bill, setBill] = useState<BillDetails>();
  const { id } = useParams();
  const path = `/api/bills/${id}`;
  // New member to add:
  const [userId, setUserId] = useState("");


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
      setError("Something went wrong");
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
      fetchBill();
      setUserId("");
    }
  }


  return (
    <div>
      <Link to="/">Home</Link>
      <br /> <br />
      <h2>{bill?.bill.name}</h2>
      { loading && <p>Loading</p>}
      { error && <p>{error}</p> }
      { !loading && !error && bill &&
        <div>
          <p>{bill.bill.amount ? `$${bill.bill.amount}` : "Unknown"}</p>
          <p>{new Date(bill.bill.dueDate).toLocaleDateString()}</p>
          <p>{bill.bill.recurrence}</p>
          <br />
          <h2>Members</h2>
          {bill.members.map(member => (
            <div key={member.userId}>
              <p>{member.userName}</p>
              <p>{member.email}</p>
              <br />
            </div>
          ))}
          <br />

          <form onSubmit={handleAddMember}>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <button type="submit">Add Member</button>
          </form>

          <br />
          <h2>Rules</h2>
          {bill.rules.map(rule => (
            <div key={rule.id}>
              <p>{rule.daysBeforeDue}</p>
              <br />
            </div>
          ))}
        </div>
      }
    </div>
  ); 
}
