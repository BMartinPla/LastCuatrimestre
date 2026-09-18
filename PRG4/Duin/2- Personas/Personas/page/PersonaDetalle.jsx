import { Link, useLocation, useParams } from 'react-router-dom';
import './PersonaDetalle.css';

export default function PersonaDetalle() {
    const { state } = useLocation();
    const { ssn } = useParams();
    const personaDesdeSesion = JSON.parse(sessionStorage.getItem("personas") || "[]")
        .find((personaGuardada) => personaGuardada.ssn === ssn);
    const persona = state?.persona || personaDesdeSesion;

    if (!persona) {
        return (
            <div className="person-detail person-detail--empty">
                <h2 className="person-detail__title">Persona no encontrada</h2>

                <Link to="/" className="person-detail__back">
                    Volver al directorio
                </Link>
            </div>
        );
    }

    return (
        <div className="person-detail">
            <h2 className="person-detail__title">Detalles de la persona</h2>

            <p className="person-detail__name">
                {persona.first_name} {persona.last_name}
            </p>

            <div className="person-detail__data">
                <div className="person-detail__item">
                    <span className="person-detail__label">Edad</span>
                    <span className="person-detail__value">{persona.age}</span>
                </div>

                <div className="person-detail__item">
                    <span className="person-detail__label">SSN</span>
                    <span className="person-detail__value">{persona.ssn}</span>
                </div>

                <div className="person-detail__item">
                    <span className="person-detail__label">Email</span>
                    <span className="person-detail__value">{persona.email}</span>
                </div>

                <div className="person-detail__item">
                    <span className="person-detail__label">Telefono</span>
                    <span className="person-detail__value">{persona.phone}</span>
                </div>

                <div className="person-detail__item">
                    <span className="person-detail__label">Pais</span>
                    <span className="person-detail__value">{persona.country}</span>
                </div>
            </div>

            <Link to="/" className="person-detail__back">
                Volver al directorio
            </Link>
        </div>
    );
}
