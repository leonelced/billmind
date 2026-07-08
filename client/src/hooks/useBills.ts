import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { apiFetch } from "../utils/auth.js";


export default function useBills(filter?: (bill: Bill) => boolean) { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const url: string = "/api/bills/";

  // this runs once when the component first renders
  useEffect(() => {
    async function loadBills() {
      try {
        const response = await apiFetch(url, { method: "GET" });
        if (!response.ok) {
          throw new Error("Request failed");          
        }
        const allBills = await response.json();
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