import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home } from './pages/Home';
import { Tareas } from './pages/Tareas';
import { Estadisticas } from './pages/Estadisticas';
import { Contenedor } from './components/Contenedor';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <div className="nav-brand">Mi App</div>
                <div className="nav-links">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? 'link-activo' : 'link-inactivo')}>
                        Inicio
                    </NavLink>
                    <NavLink to="/tareas" className={({ isActive }) => (isActive ? 'link-activo' : 'link-inactivo')}>
                        Tareas
                    </NavLink>
                    <NavLink to="/estadisticas" className={({ isActive }) => (isActive ? 'link-activo' : 'link-inactivo')}>
                        Estadísticas
                    </NavLink>
                </div>
            </nav>

            <main className="content">
                <Routes>
                    {/* Home queda libre, con su propio estilo */}
                    <Route path="/" element={<Home />} />

                    {/* Tareas y Estadísticas se pasan como hijos directos del Contenedor */}
                    <Route
                        path="/tareas"
                        element={
                            <Contenedor>
                                <Tareas />
                            </Contenedor>
                        }
                    />
                    <Route
                        path="/estadisticas"
                        element={
                            <Contenedor>
                                <Estadisticas />
                            </Contenedor>
                        }
                    />

                    <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;