import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Adduser from './pages/admin/Adduser.js';
import Dashbord from './pages/admin/Dashboard.js';
import './index.css'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/admin' element={<Dashbord/>}/>
        <Route path='/admin/adduser' element={<Adduser/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
