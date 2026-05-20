import { useState } from "react";

export default function Login() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface LoginResponse {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    token: string;
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const url: string = "/api/auth/login";
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json() as LoginResponse;
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
}


