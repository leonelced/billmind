import { useState, useEffect } from "react";
import { type Bill } from "../types.js";
import { useApiRequest } from "./useApiRequest.js";


export default function useBills(filter?: (bill: Bill) => boolean) { 
  const { run, loading, error } = useApiRequest();
  const [bills, setBills] = useState<Bill[]>([]);

  // this runs once when the component first renders
  useEffect(() => {
    async function loadBills() {
      const { data } = await run<Bill[]>("/api/bills/", { method: "GET" });
      if (data) setBills(filter ? data.filter(filter) : data);
    }
    loadBills();
  }, [run, filter]); // must be memoized by caller, or this causes an infinite refetch loop
  // If effect reads a value, it shoud be in the dependency array.
  // Only re-run this effect when one of these values (run, filter) changes.

  return { bills, loading, error };
}