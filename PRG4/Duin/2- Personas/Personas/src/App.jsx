// 1. Importamos las herramientas de enrutamiento
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// 2. Importamos nuestras dos páginas
import Personas from '../page/Personas';
import AltaPersona from '../page/AltaPersona';

export default function App() {
    return (
        /* BrowserRouter envuelve TODO lo que necesite navegación */
        <BrowserRouter>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>

                <header style={{ borderBottom: '1px solid #ccc', marginBottom: '20px', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Directorio de Usuarios</h1>

                    {/* 3. BOTÓN DE ALTA: Usamos Link en vez de <button> o <a> */}
                    <Link
                        to="/alta"
                        style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}
                    >
                        + Nuevo Usuario
                    </Link>
                </header>

                <main>
                    {/* 4. ROUTES: Acá definimos qué componente se muestra según la URL */}
                    <Routes>
                        <Route path="/" element={<Personas />} />
                        <Route path="/alta" element={<AltaPersona />} />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}