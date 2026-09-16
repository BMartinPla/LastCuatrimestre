import './PersonasList.css';

export default function PersonasList({ persona, onToggle }) {
    const isSelected = persona.Seleccionado === "s";

    return (
        <div
            className={`person-card ${persona.age < 35 ? "person-card--young" : ""} ${isSelected ? "person-card--selected" : ""}`}
            onClick={onToggle}
        >
            {/* Usamos las propiedades exactas de la API */}
            <p className="person-card__name"><strong>Persona:</strong> {persona.last_name}, {persona.first_name}</p>
            <small className="person-card__meta">Edad: {persona.age} - SSN: {persona.ssn}</small>
            <br />
            <small className="person-card__email">Email: {persona.email}</small>
        </div>
    );
}
