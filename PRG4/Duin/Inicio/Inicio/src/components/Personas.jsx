// import datos from '../data/Personas.json';
// import PersonasCard from './PersonasCard';

// export function Personas() {

//     return (
//         <>
//             <div>
//                 <h2>Persona</h2>
//                 <div>
//                     {datos.Personas.map((persona) => (
//                         <PersonasCard key={persona.ID} persona={persona}></PersonasCard>
//                     ))}
//                 </div>
//             </div>
//         </>
//     )

// }

// export default Personas;

import { useState } from 'react';
import datos from '../data/Personas.json';
import PersonasCard from './PersonasCard';

export function Personas() {
    // 1. Guardamos el array del JSON en un estado para poder modificar sus atributos
    const [personas, setPersonas] = useState(datos.Personas);
    
    // 2. Estado para el toggle (mostrar todos vs mostrar solo seleccionados)
    const [mostrarSeleccionados, setMostrarSeleccionados] = useState(false);

    // 3. Función para cambiar de "n" a "s" (o viceversa)
    const toggleSeleccion = (id) => {
        setPersonas((prevPersonas) =>
            prevPersonas.map((persona) => {
                // Buscamos a la persona que clickeamos por su ID
                if (persona.ID === id) {
                    return {
                        ...persona, // Copiamos todos los datos de la persona
                        Seleccionado: persona.Seleccionado === "n" ? "s" : "n" // Alternamos el valor
                    };
                }
                return persona; // Los demás los dejamos igual
            })
        );
    };

    // 4. Lógica de filtrado basándonos en el atributo "Seleccionado"
    const personasAMostrar = mostrarSeleccionados 
        ? personas.filter(persona => persona.Seleccionado === "s")
        : personas;

    return (
        <div>
            <h2>Personas</h2>
            
            {/* Checkbox a modo de Toggle Button */}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    <input 
                        type="checkbox" 
                        checked={mostrarSeleccionados}
                        onChange={(e) => setMostrarSeleccionados(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Mostrar solo personas seleccionadas
                </label>
            </div>

            <div>
                {/* Mapeamos la lista filtrada */}
                {personasAMostrar.map((persona) => (
                    <PersonasCard 
                        key={persona.ID} 
                        persona={persona}
                        onToggle={() => toggleSeleccion(persona.ID)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Personas;