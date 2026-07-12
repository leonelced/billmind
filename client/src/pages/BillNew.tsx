import BillForm from "#components/BillForm";
import { API } from "../utils/api";

export default function NewBill() {
  return (
    <BillForm path={API.bills.list()} reqMethod="POST" title="+ New Bill"/>
  );
}