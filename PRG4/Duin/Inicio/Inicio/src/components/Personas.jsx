import datos from '../data/Personas.json';
import PersonasCard from './PersonasCard';

export function Personas() {

    return (
        <>
            <div>
                <h2>Persona</h2>
                <div>
                    {datos.Personas.map((persona) => (
                        <PersonasCard key={persona.ID} persona={persona}></PersonasCard>
                    ))}
                </div>
            </div>
        </>
    )

}

export default Personas;