import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewBill from './pages/NewBill';
import Bill from './pages/Bill';

function App() {
  return (
    <div>
      <BrowserRouter>
        <h1>BillMind</h1>
        <br />
        <Routes>
          <Route path='/' element={<Home />}/>  
          <Route path='/register' element={<Register />}/>  
          <Route path='/login' element={<Login />}/>  
          <Route path='/bills/new' element={<NewBill />}/>  
          <Route path='/bills/:id' element={<Bill />}/>  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
