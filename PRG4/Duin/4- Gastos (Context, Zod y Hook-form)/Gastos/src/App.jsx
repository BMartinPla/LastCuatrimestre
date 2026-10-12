import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { GastosProvider } from './context/GastosContext';
import { Gastos } from './pages/Gastos';
import { Resumen } from './pages/Resumen';
import { ModificarGasto } from './pages/ModificarGasto';
import './App.css';

function ContenidoApp() {
  const location = useLocation();
  const editando = location.pathname.startsWith('/modificar');

  return (
    <>
      {/* Si está editando, oculta la navegación para ocupar toda la pantalla */}
      {!editando && (
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
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Gastos />} />
          <Route path="/modificar/:id" element={<ModificarGasto />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="*" element={<h2>404 - No encontrado</h2>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <GastosProvider>
      <BrowserRouter>
        <ContenidoApp />
      </BrowserRouter>
    </GastosProvider>
  );
}