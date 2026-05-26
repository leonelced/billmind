import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewBill from './pages/NewBill';
import Bill from './pages/Bill';
import Navigation from './components/Navbar';


function AppContent() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);
  return (
    <div>
      <h1>BillMind</h1>
      {isAuthenticated && !hideNavbar && <Navigation/>}
      <br />
      <Routes>
        <Route path='/' element={<Home />}/>  
        <Route path='/register' element={<Register />}/>  
        <Route path='/login' element={<Login />}/>  
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/bills/new' element={<NewBill />}/>  
        <Route path='/bills/:id' element={<Bill />}/>  
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
