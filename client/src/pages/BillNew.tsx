import BillForm from "#components/BillForm";

export default function NewBill() {
  return (
    <BillForm path="/api/bills/" reqMethod="POST" title="+ New Bill"/>
  );
}