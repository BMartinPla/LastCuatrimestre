const calcularEdad = (Fecha_Nac) => {
    const nacimiento = new Date(Fecha_Nac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
    if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

export default function PersonasCard({ persona }) {
    const edadCalculada = calcularEdad(persona.Fecha_Nac);


    return (
        // Usamos el ID único que ya viene en tu JSON para la "key"
        <div
            key={persona.ID}
            className={edadCalculada > 35 ? "card text_negro" : "card text_rojo"}
        >
            {/* Ojo: en tu JSON los atributos empiezan con mayúscula (Apellido, Nombre) */}
            <p>Persona: {persona.Apellido}, {persona.Nombre}</p>
            <small>Edad: {edadCalculada} - DNI: {persona.DNI}</small>
        </div>
    );

}