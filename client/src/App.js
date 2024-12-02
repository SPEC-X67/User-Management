import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from './Components/Register.js';
import Home from './pages/Home.js';
import './index.css'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
