import { useState, useEffect } from "react";


interface Bill {
  id: string,
  ownerId: string,
  name: string,
  amount: string | null,
  dueDate: string,
  recurrence: string,
  isPaid: boolean,
  createdAt: string
}


export default function Home() { 
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
      <h1>Home Page</h1>
      { loading && <p>Loading...</p>}
      { error && <p>{error}</p> }
      {!loading && !error && bills.map((bill) => (
        <div key={bill.id}>
          <p>{bill.name}</p>
          <p>{bill.amount ? `$${bill.amount}` : "Unknown"}</p>
          <p>{new Date(bill.dueDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  ); 
}
