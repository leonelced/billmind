import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function NewBill() { 
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const path = "/api/bills/";
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name,
          dueDate,
          recurrence,
          amount
        })
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    }
    
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Bill Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <label>Due Date</label>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <br />
      <label>Amount</label>
      <input type="number" value={amount ?? ""} 
        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)} 
      />
      <br />
      <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
        <option value="">Select recurrence</option>
        <option value="once">Once</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <br />
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
    </form>
  ); 
}
