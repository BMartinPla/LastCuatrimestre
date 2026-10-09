import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Gastos } from './pages/Gastos';
import { Resumen } from './pages/Resumen';
import { ModificarGasto } from './pages/ModificarGasto';
import './App.css';

function App() {
  const [gastos, setGastos] = useState([]);
  const [nextId, setNextId] = useState(1);

  return (
    <BrowserRouter>
      <nav className="navbar-gastos">
        <div className="navbar-title">GASTOS PERSONALES</div>
        <div className="navbar-links">
          <NavLink to="/" end className="nav-item">
            {({ isActive }) => (isActive ? 'Gastos (Actual)' : 'Gastos')}
          </NavLink>
          <NavLink to="/resumen" className="nav-item">
            {({ isActive }) => (isActive ? 'Resumen (Actual)' : 'Resumen')}
          </NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Gastos
                gastos={gastos}
                setGastos={setGastos}
                nextId={nextId}
                setNextId={setNextId}
              />
            }
          />
          <Route 
            path="/modificar/:id" 
            element={<ModificarGasto gastos={gastos} setGastos={setGastos} />} 
          />
          <Route path="/resumen" element={<Resumen gastos={gastos} />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;