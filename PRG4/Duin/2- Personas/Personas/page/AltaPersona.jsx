import { Link } from 'react-router-dom';
import './AltaPersona.css';

export default function AltaPersona() {
    return (
        <div className="alta-page">
            <h2>Dar de Alta Nuevo Usuario</h2>

            <form className="alta-form">
                <input className="form-input" type="text" placeholder="Nombre" />
                <input className="form-input" type="text" placeholder="Apellido" />
                <input className="form-input" type="email" placeholder="Email" />

                <button
                    type="button"
                    className="button button--success"
                >
                    Guardar
                </button>
            </form>

            {/* El Link act�a como un bot�n para volver a la ruta principal ("/") */}
            <Link to="/" className="back-link">
                ? Volver al directorio
            </Link>
        </div>
    );
}
