import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './Login.jsx'
import { Home } from './pages/Home';
import { Habitaciones } from './pages/Habitaciones.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
