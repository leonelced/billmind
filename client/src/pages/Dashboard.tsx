import useBills from "#hooks/useBills";
import { BillsGrid } from "#components/BillsGrid";


export default function Dashboard() { 
  const { bills, loading, error } = useBills();
  return <BillsGrid bills={bills} loading={loading} error={error} showTotal={false}/>; 
}
