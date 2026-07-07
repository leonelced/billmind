import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { fetchBills } from "../utils/bills.js";
import { BillsGrid } from "#components/BillsGrid";


export default function Dashboard() { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);

  // this runs once when the component first renders
  useEffect(() => {
    async function loadBills() {
      try {
        const bills: Bill[] = await fetchBills();
        setBills(bills);
      } catch(err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false);
      }
    }
    loadBills();
  }, []); // the [] means "only run once on mount"

  return <BillsGrid bills={bills} loading={loading} error={error} />; 
}
