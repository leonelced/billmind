import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { Link } from "react-router-dom";


export default function Dashboard() { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const url: string = "/api/bills/";

  // this runs once when the component first renders
  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchBills() {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        if (!response.ok) { // http errors
          setError("Response failed");
          return;
        }
        const data = await response.json();
        setBills(data);
      } catch (err) { // network errors
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []); // the [] means "only run once on mount"

  return (
    <div>
      { loading && <p>Loading...</p>}
      { error && <p>{error}</p> }
      <Link to="/bills/new">+ New Bill</Link>
      <br /> <br />
      {!loading && !error && bills.map((bill) => (
        <div key={bill.id}>
          <Link to={`/bills/${bill.id}`}>
            <p>{bill.name}</p>
          </Link>
          <p>{bill.amount ? `$${bill.amount}` : "Unknown"}</p>
          <p>{new Date(bill.dueDate).toLocaleDateString()}</p>
          <br />
        </div>
      ))}
    </div>
  ); 
}
