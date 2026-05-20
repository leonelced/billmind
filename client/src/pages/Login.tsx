import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface LoginResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  token: string;
}


export default function Login() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const url: string = "/api/auth/login";
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      setError("Invalid email or password");
      return;
    }
    const data = await response.json() as LoginResponse;
    localStorage.setItem('token', data.token);
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      { error && <p>{error}</p> }
      <button>Login</button>
    </form>
  );
}


