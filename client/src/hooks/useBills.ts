import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { fetchBills } from "../utils/bills.js";


export default function useBills(filter?: (bill: Bill) => boolean) { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);

  // this runs once when the component first renders
  useEffect(() => {
    async function loadBills() {
      try {
        const allBills: Bill[] = await fetchBills();
        // const monthlyBills = bills.filter(bill => bill.recurrence === "monthly")
        setBills(filter? allBills.filter(filter) : allBills);
      } catch(err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false);
      }
    }
    loadBills();
  }, []); // the [] means "only run once on mount"

  return { bills, loading, error };
}
