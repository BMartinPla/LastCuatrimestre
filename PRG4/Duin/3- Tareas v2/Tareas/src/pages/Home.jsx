import { Link, useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Panel Principal</h1>
            <p>Bienvenido al gestor de actividades y proyectos.</p>

            <div className="home-actions">
                <Link to="/tareas" className="btn-primary">
                    Ir a Lista de Tareas
                </Link>

                <Link to="/estadisticas" className="btn-primary">
                    Ir a Estadisticas
                </Link>

                {/*<button*/}
                {/*    onClick={() => navigate('/tareas')}*/}
                {/*    className="btn-secondary"*/}
                {/*>*/}
                {/*    Navegar por código*/}
                {/*</button>*/}
            </div>
        </div>
    );
}