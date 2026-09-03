import { useState } from 'react';
import datos from '../data/Personas.json';
import PersonasCard from './PersonasCard';

export function Personas() {
     // 1. Guardamos el array del JSON en un estado para poder modificar sus atributos
     const [personas, setPersonas] = useState(datos.Personas);
    
     // 2. Estado para el toggle (mostrar todos vs mostrar solo seleccionados)
    const [mostrarSeleccionados, setMostrarSeleccionados] = useState(false);

    const [busqueda, setBusqueda] = useState("");

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

    const termino = busqueda.trim().toLowerCase();

    const personasAMostrar = personas.filter((persona) => {
        // Condición 1: Filtro de selección
        const coincideSeleccion = mostrarSeleccionados ? persona.Seleccionado === "s" : true;

        // Condición 2: Filtro de texto (busca en Nombre o Apellido)
        const coincideBusqueda =
            persona.Nombre.toLowerCase().includes(termino) ||
            persona.Apellido.toLowerCase().includes(termino);

        return coincideSeleccion && coincideBusqueda;
    });

        // 4. Lógica de filtrado basándonos en el atributo "Seleccionado"
    //const personasAMostrar = mostrarSeleccionados 
    //    ? personas.filter(persona => persona.Seleccionado === "s")
    //    : personas;
     
    return (
        <div>
            <h2>Personas</h2>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o apellido..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
                />
            </div>
            
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
