import { Link } from "react-router-dom";
import { useState } from "react";
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
import { API } from "../utils/api";
import DeleteAccountDialog from "./UserDelete";


export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const hideNavButtons = ["/", "/login", "/register"].includes(location.pathname);
  const hideAuthButtons = ["/login", "/register"].includes(location.pathname);
  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/bills/monthly", label: "Monthly" },
    { to: "/bills/yearly", label: "Yearly" },
    { to: "/bills/new", label: "+ New Bill" },
  ];

  async function handleLogout() {
    await fetch(API.auth.revoke(), {
      method: 'POST',
      credentials: "include" // sends the httpOnly refresh cookie automatically
    });
    localStorage.clear();
    navigate("/");
  }
  
  return (
    <div className="flex items-center justify-between px-4">

      <h1 className="text-xl font-bold">BillMind</h1>

      {!isAuthenticated() && !hideAuthButtons && (
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
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Button key={to} variant="ghost" asChild
                className={`rounded-full ${ active
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link to={to}>{label}</Link>
              </Button>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
              >
                Account <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild 
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="update">Update</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} 
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={(e) => {
                 e.preventDefault();
                 setDeleteOpen(true);
                }}
                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
        </div>
      )}
    </div>
  );
}
