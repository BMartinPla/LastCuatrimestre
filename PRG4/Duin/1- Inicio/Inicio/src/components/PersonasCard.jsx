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

export default function PersonasCard({ persona, onToggle }) {
    const isSelected = persona.Seleccionado === "s";
    const edadCalculada = calcularEdad(persona.Fecha_Nac);


    return (
        
        // Usamos el ID �nico que ya viene en tu JSON para la "key"
        <div
            key={persona.ID}
            className={`card ${edadCalculada < 35 ? "text_rojo" : ""} ${isSelected ? "card--selected" : ""}`}
            onClick={onToggle}

        >
            {/* Ojo: en tu JSON los atributos empiezan con may�scula (Apellido, Nombre) */}
            <p>Persona: {persona.Apellido}, {persona.Nombre}</p>
            <small>Edad: {edadCalculada} - DNI: {persona.DNI}</small>
        </div>
    );

}

// const calcularEdad = (Fecha_Nac) => {
//     const nacimiento = new Date(Fecha_Nac);
//     const hoy = new Date();
//     let edad = hoy.getFullYear() - nacimiento.getFullYear();
//     const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
//     if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
//         edad--;
//     }
//     return edad;
// };

// // Recibimos la persona y la función onToggle
// export default function PersonasCard({ persona, onToggle }) {
//     const edadCalculada = calcularEdad(persona.Fecha_Nac);
    
//     // Evaluamos si está seleccionada leyendo el atributo de tu JSON
//     const isSelected = persona.Seleccionado === "s";

//     return (
//         <div 
//             className={edadCalculada > 35 ? "card text_negro" : "card text_rojo"}
//             style={{ 
//                 border: isSelected ? '2px solid blue' : '1px solid #ccc',
//                 marginBottom: '10px',
//                 padding: '10px'
//             }}
//         >
//             <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                 {/* Checkbox amarrado al estado "s" o "n" */}
//                 <input 
//                     type="checkbox" 
//                     checked={isSelected} 
//                     onChange={onToggle}
//                     style={{ marginRight: '15px', transform: 'scale(1.5)' }}
//                 />
                
//                 <div>
//                     <p style={{ margin: '0 0 5px 0' }}>Persona: {persona.Apellido}, {persona.Nombre}</p>
//                     <small>Edad: {edadCalculada} - DNI: {persona.DNI}</small>
//                 </div>
//             </label>
//         </div>
//     );
// }