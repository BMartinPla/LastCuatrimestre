import PersonasList from './PersonasList';

export default function PersonasGrid({ personas, onToggle }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
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