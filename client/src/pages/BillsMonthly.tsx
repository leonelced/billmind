import useBills from "#hooks/useBills";
import { BillsGrid } from "#components/BillsGrid";


export default function BillsMonthly() { 
  const { bills, loading, error } = useBills(bill => bill.recurrence === "monthly");
  return <BillsGrid bills={bills} loading={loading} error={error} />; 
}
