import { Link } from 'react-router-dom';

export default function AltaPersona() {
    return (
        <div>
            <h2>Dar de Alta Nuevo Usuario</h2>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', marginBottom: '20px' }}>
                <input type="text" placeholder="Nombre" style={{ padding: '8px' }} />
                <input type="text" placeholder="Apellido" style={{ padding: '8px' }} />
                <input type="email" placeholder="Email" style={{ padding: '8px' }} />

                <button
                    type="button"
                    style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Guardar
                </button>
            </form>

            {/* El Link actúa como un botón para volver a la ruta principal ("/") */}
            <Link to="/" style={{ color: 'blue', textDecoration: 'none' }}>
                ? Volver al directorio
            </Link>
        </div>
    );
}