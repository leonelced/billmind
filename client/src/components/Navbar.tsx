import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "#components/ui/button";


export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const hideDashboardLink = ["/dashboard"].includes(location.pathname);
  const hideNewBillButton = ["/bills/new"].includes(location.pathname);
  const hideUpdateUserButton = ["/update"].includes(location.pathname);

  async function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    await fetch("/api/auth/revoke", {
      method: 'POST',
      headers: {'Authorization': `Bearer ${refreshToken}`}
    });
    localStorage.clear();
    navigate("/");
  }
  
  return (
    <div>
      <Button variant="ghost">
        {!hideDashboardLink && <Link to="/dashboard">Dashboard</Link>}
      </Button>
      <Button variant="ghost">
        {!hideNewBillButton && <Link to="bills/new">+ New Bill</Link>}
      </Button>
      <Button variant="ghost">
        {!hideUpdateUserButton && <Link to="update">Update User Info</Link>}
      </Button>
      <Button onClick={handleLogout} variant="ghost">
        Logout
      </Button>
    </div>
  );
}


