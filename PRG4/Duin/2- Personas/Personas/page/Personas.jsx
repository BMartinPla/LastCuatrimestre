import { useState, useEffect } from 'react';
import PersonasFiltro from '../components/PersonasFiltro';
import PersonasGrid from '../components/PersonasGrid';
import './Personas.css';

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

                // 1. MIR� ESTA L�NEA: Nos va a mostrar en la consola qu� devolvi� realmente la API
                console.log("Respuesta de la API:", data);

                // 2. Dependiendo de lo que diga la consola, puede que tengamos que cambiar esta l�nea
                const personasDeApi = data.data;

                console.log("Personas procesadas:", personasDeApi); // Para ver si el array se arm� bien

                const personasConEstado = personasDeApi.map(persona => ({
                    ...persona,
                    Seleccionado: "n"
                }));

                sessionStorage.setItem("personas", JSON.stringify(personasConEstado));
                setPersonas(personasConEstado);
            } catch (error) {
                // 3. Si hay un error de conexi�n o CORS, va a caer ac�
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
                // Usamos el ssn como identificador �nico porque no hay ID
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

        // 2. ADAPTAMOS LA B�SQUEDA A LAS NUEVAS CLAVES
        const nombreCompleto = `${persona.first_name} ${persona.last_name}`.toLowerCase();
        const coincideBusqueda = nombreCompleto.includes(termino);

        return coincideSeleccion && coincideBusqueda;
    });

    return (
        <div className="directory-page">
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
