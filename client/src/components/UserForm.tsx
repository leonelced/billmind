import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "#components/ui/label";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { apiFetch, validatePassword } from "../utils/auth";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export type UserFormProps = {
  path: string;
  title: string;
  redirect: string;
  reqMethod: string;
  submitBtnName: string;
  isRegistration?: boolean;
}


export default function UserForm(props: UserFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    if (props.isRegistration) {
      const err = validatePassword(password);
      if (err) {
        setError(err);
        return;
      }
    }
    try {
      const response = await apiFetch(props.path, { 
        method: props.reqMethod, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }) 
      });
      if (!response.ok) {
        let backendMessage: string | undefined;
        const data = await response.json();
        backendMessage = data?.message ?? data?.error;
        throw new Error(backendMessage || "Request failed");
      }
      navigate(props.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } 
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-sm pt-0">
        <Link to={props.isRegistration ? "/" : "/dashboard"} 
          className="p-4 inline-block text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <CardHeader className="-mt-4">
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label>Username</Label>
              <Input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <Input 
                placeholder="Confirm Password"
                type="password" 
                value={passwordConfirmation} 
                onChange={(e) => setPasswordConfirmation(e.target.value)} 
              />
              {
                password && 
                password.length < 12 &&
                (<p className="text-sm text-red-500">Password must be at least 12 characters long</p>)
              }
              {
                passwordConfirmation &&
                password !== passwordConfirmation &&
                (<p className="text-sm text-red-500">Passwords do not match</p>)
              }
            </div>
            { error && <p>{error}</p> }
            <Button>{props.submitBtnName}</Button>
          </form>
        </CardContent>
        {
          props.isRegistration && 
          <p className="text-sm text-center text-gray-500">
            Already have an account? <Link to="/login" className="underline">Log in</Link>
          </p>
        }
      </Card>
    </div>    
  );
}
