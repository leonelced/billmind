import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "#components/ui/button";


export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const hideDashboardLink = ["/dashboard"].includes(location.pathname);
  const hideNewBillButton = ["/bills/new"].includes(location.pathname);

  function handleLogout() {
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
      <Button onClick={handleLogout} variant="ghost">
        Logout
      </Button>
    </div>
  );
}


