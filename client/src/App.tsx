import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewBill from './pages/NewBill';
import Bill from './pages/Bill';
import Navigation from './components/Navbar';
import { isAuthenticated } from './utils/auth';
document.documentElement.classList.add("dark");


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate to="/"/>;
  return children;
}

function PublicRoute({ children }: { children: React.ReactNode}) {
  if (isAuthenticated()) return <Navigate to="/dashboard"/>;
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);
  return (
    <div>
      <h1>BillMind</h1>
      {isAuthenticated() && !hideNavbar && <Navigation/>}
      <br />
      <Routes>
        <Route path='/' element={<PublicRoute><Home /></PublicRoute>}/>  
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>}/>  
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>}/>  
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/bills/new' element={<ProtectedRoute><NewBill /></ProtectedRoute>}/>  
        <Route path='/bills/:id' element={<ProtectedRoute><Bill /></ProtectedRoute>}/>  
        <Route path='*' element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"}/>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <AppContent/>
      </BrowserRouter>
    </div>
  );
}

export default App;
