import { useState, useEffect } from 'react';
import PersonasFiltro from '../components/PersonasFiltro';
import PersonasGrid from '../components/PersonasGrid';

export default function Personas() {
    const [personas, setPersonas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarSeleccionados, setMostrarSeleccionados] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const respuesta = await fetch("https://generate-random.org/api/v1/generate/persons?locale=en_US&count=50");
                const data = await respuesta.json();

                // 1. MIRÁ ESTA LÍNEA: Nos va a mostrar en la consola qué devolvió realmente la API
                console.log("Respuesta de la API:", data);

                // 2. Dependiendo de lo que diga la consola, puede que tengamos que cambiar esta línea
                const personasDeApi = data.data;

                console.log("Personas procesadas:", personasDeApi); // Para ver si el array se armó bien

                const personasConEstado = personasDeApi.map(persona => ({
                    ...persona,
                    Seleccionado: "n"
                }));

                setPersonas(personasConEstado);
            } catch (error) {
                // 3. Si hay un error de conexión o CORS, va a caer acá
                console.error("Error al traer los datos:", error);
            } finally {
                setCargando(false);
            }
        }

        fetchData();
    }, []);

    const toggleSeleccion = (ssnId) => {
        setPersonas((prevPersonas) =>
            prevPersonas.map((persona) => {
                // Usamos el ssn como identificador único porque no hay ID
                if (persona.ssn === ssnId) {
                    return {
                        ...persona,
                        Seleccionado: persona.Seleccionado === "s" ? "n" : "s"
                    };
                }
                return persona;
            })
        );
    };

    const termino = busqueda.trim().toLowerCase();

    const personasAMostrar = personas.filter((persona) => {
        const coincideSeleccion = mostrarSeleccionados ? persona.Seleccionado === "s" : true;

        // 2. ADAPTAMOS LA BÚSQUEDA A LAS NUEVAS CLAVES
        const nombreCompleto = `${persona.first_name} ${persona.last_name}`.toLowerCase();
        const coincideBusqueda = nombreCompleto.includes(termino);

        return coincideSeleccion && coincideBusqueda;
    });

    return (
        <div>
            <h2>Directorio de Personas</h2>

            <PersonasFiltro
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                mostrarSeleccionados={mostrarSeleccionados}
                setMostrarSeleccionados={setMostrarSeleccionados}
            />

            {cargando ? (
                <p>Cargando datos desde la API...</p>
            ) : (
                <PersonasGrid
                    personas={personasAMostrar}
                    onToggle={toggleSeleccion}
                />
            )}
        </div>
    );
}

//import { useState } from 'react';

//export default function Personas() {
//    const [personas, setPersonas] = useState(null);

//    useEffect(() => {
//        async function fetchData() {
//            const respuesta = await fetch("https://generate-random.org/api/v1/generate/persons?locale=en_US&count=10");
//            const data = await respuesta.json();
//        }
//    })

//    setPersonas(data.results);

//    return (
//        <>
//            <div>
//                <PersonasFiltro></PersonasFiltro>
//                <PersonasGrid Personas={ }></PersonasGrid>
//            </div>
//        </>
//    )
//}