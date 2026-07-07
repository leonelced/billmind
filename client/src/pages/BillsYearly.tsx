import useBills from "#hooks/useBills";
import { BillsGrid } from "#components/BillsGrid";


export default function BillsYearly() { 
  const { bills, loading, error } = useBills(bill => bill.recurrence === "yearly"); // *********** change raw string with Enum or something
  return <BillsGrid bills={bills} loading={loading} error={error} />; 
}
