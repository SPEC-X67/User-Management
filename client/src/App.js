import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './Components/Register.js';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
