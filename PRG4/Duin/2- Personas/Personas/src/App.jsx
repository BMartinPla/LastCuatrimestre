import { useState } from 'react'
// Salimos de "src" con "../" y entramos a "page"
import Personas from '../page/Personas';

export default function App() {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ borderBottom: '1px solid #ccc', marginBottom: '20px', paddingBottom: '10px' }}>
                <h1>Directorio de Usuarios</h1>
            </header>

            <main>
                <Personas />
            </main>
        </div>
    );
}
