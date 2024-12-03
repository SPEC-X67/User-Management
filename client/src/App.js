import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Adduser from './pages/admin/Adduser.js';
import Dashbord from './pages/admin/Dashboard.js';
import Home from './pages/user/Home.js';
import Login from './pages/user/Login.js';
import Register from './pages/user/Register.js';
import AdminLogin from './pages/admin/adminLogin.js';

import './index.css'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/admin/dashboard' element={<Dashbord/>}/>
        <Route path='/admin/adduser' element={<Adduser/>}/>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
