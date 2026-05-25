import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/login")}>Login</button>
      <br />
      <br />
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
}