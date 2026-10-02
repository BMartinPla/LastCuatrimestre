import { Link } from 'react-router-dom';

export function Contenedor({ children }) {
    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <Link to="/" className="link-volver">Volver al Inicio</Link>
            </div>

            {/* Acá se inyecta Tareas o Estadísticas tal cual son */}
            {children}
        </div>
    );
}