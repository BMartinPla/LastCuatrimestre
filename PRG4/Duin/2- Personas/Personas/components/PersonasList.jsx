export default function PersonasList({ persona, onToggle }) {
    const isSelected = persona.Seleccionado === "s";

    return (
        <div
            className={`card ${persona.age < 35 ? "text_rojo" : ""} ${isSelected ? "card--selected" : ""}`}
            onClick={onToggle}
            style={{
                border: isSelected ? '2px solid #28a745' : '1px solid #ccc',
                padding: '15px',
                cursor: 'pointer',
                borderRadius: '8px'
            }}
        >
            {/* Usamos las propiedades exactas de la API */}
            <p><strong>Persona:</strong> {persona.last_name}, {persona.first_name}</p>
            <small>Edad: {persona.age} - SSN: {persona.ssn}</small>
            <br />
            <small>Email: {persona.email}</small>
        </div>
    );
}