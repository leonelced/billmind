import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';
import Dashboard from './pages/Dashboard';
import BillNew from './pages/BillNew';
import Bill from './pages/Bill';
import BillsMonthly from './pages/BillsMonthly';
import UserUpdate from './pages/UserUpdate';
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
  return (
    <div>
      <Navigation/>
      <Routes>
        <Route path='/' element={<PublicRoute><Home /></PublicRoute>}/>  
        <Route path='/register' element={<PublicRoute><UserRegister /></PublicRoute>}/>  
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>}/>  
        
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/bills/monthly' element={<ProtectedRoute><BillsMonthly /></ProtectedRoute>}/>  

        <Route path='/bills/new' element={<ProtectedRoute><BillNew /></ProtectedRoute>}/>  
        <Route path='/bills/:id' element={<ProtectedRoute><Bill /></ProtectedRoute>}/>  
        <Route path='/update' element={<ProtectedRoute><UserUpdate /></ProtectedRoute>}/>  
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
