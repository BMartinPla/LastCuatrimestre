// 1. Importamos las herramientas de enrutamiento
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 2. Importamos nuestras dos p�ginas
import Personas from '../page/Personas';
import AltaPersona from '../page/AltaPersona';

export default function App() {
    return (
        /* BrowserRouter envuelve TODO lo que necesite navegaci�n */
        <BrowserRouter>
            <div className="app-shell">

                <header className="app-header">
                    <div>
                        <h1>Directorio de Usuarios</h1>
                    </div>

                    {/* 3. BOT�N DE ALTA: Usamos Link en vez de <button> o <a> */}
                    <Link
                        to="/alta"
                        className="button button--primary"
                    >
                        + Nuevo Usuario
                    </Link>
                </header>

                <main className="app-main">
                    {/* 4. ROUTES: Ac� definimos qu� componente se muestra seg�n la URL */}
                    <Routes>
                        <Route path="/" element={<Personas />} />
                        <Route path="/alta" element={<AltaPersona />} />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}
