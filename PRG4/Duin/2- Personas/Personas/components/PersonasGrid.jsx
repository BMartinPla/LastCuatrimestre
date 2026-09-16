import PersonasList from './PersonasList';
import './PersonasGrid.css';

export default function PersonasGrid({ personas, onToggle }) {
    return (
        <div className="people-grid">
            {personas.map(persona => (
                <PersonasList
                    key={persona.ssn}
                    persona={persona}
                    onToggle={() => onToggle(persona.ssn)}
                />
            ))}
        </div>
    );
}
