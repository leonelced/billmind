import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


interface LoginResponse {
  id: string;
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

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const url: string = "/api/auth/login";
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });
    if (!response.ok) {
      setError("Invalid email or password");
      return;
    }
    const data = await response.json() as LoginResponse;
    localStorage.setItem('token', data.token);
    navigate("/dashboard");
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-sm pt-0">
        <Link to="/" className="p-4 inline-block text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <CardHeader className="-mt-4">
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="underline">Create one</Link>
        </p>
      </Card>
    </div>
  );
}


