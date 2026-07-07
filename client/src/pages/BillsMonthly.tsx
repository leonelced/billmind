import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { fetchBills } from "../utils/bills.js";
import { BillsGrid } from "#components/BillsGrid";


export default function BillsMonthly() { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    async function loadBills() {
      try {
        const bills: Bill[] = await fetchBills();
        const monthlyBills = bills.filter(bill => bill.recurrence === "monthly")
        setBills(monthlyBills);
      } catch(err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false);
      }
    }
    loadBills();
  }, []); // [] === "only run once on mount"

  return <BillsGrid bills={bills} loading={loading} error={error} />; 
}
