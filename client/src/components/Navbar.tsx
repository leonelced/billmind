import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "#components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { isAuthenticated } from "../utils/auth";


export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const hideDashboardLink = ["/dashboard"].includes(location.pathname);
  const hideNewBillButton = ["/bills/new"].includes(location.pathname);
  const hideNavButtons = ["/", "/login", "/register"].includes(location.pathname);


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
    <div className="flex items-center justify-between px-4 py-2">

      <h1 className="text-xl font-bold">BillMind</h1>

      {!isAuthenticated() && hideNavButtons && (
        <div>
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      )}
      
      {isAuthenticated() && !hideNavButtons && (
        <div>
          <Button variant="ghost">
            {!hideDashboardLink && <Link to="/dashboard">Dashboard</Link>}
          </Button>
          <Button variant="ghost">
            {!hideNewBillButton && <Link to="bills/new">+ New Bill</Link>}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Account <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="update">Update</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
