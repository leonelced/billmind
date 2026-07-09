import useBills from "#hooks/useBills";
import { BillsGrid } from "#components/BillsGrid";
import { useMemo } from "react";
import type { Bill } from "../types";


export default function BillsYearly() { 
  // useMemo keeps this the SAME function reference across renders.
  // Without it, a new filter function would be created on every render, useBills' effect
  // would see "filter changed" every time, and refetch in an infinite loop.
  const filter = useMemo(() => (bill: Bill) => bill.recurrence === "yearly", []);
  const { bills, loading, error } = useBills(filter);
  return <BillsGrid bills={bills} loading={loading} error={error} showTotal={true} />; 
}
