export default function PersonasFiltro({
    busqueda,
    setBusqueda,
    mostrarSeleccionados,
    setMostrarSeleccionados
}) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Buscar por nombre o apellido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ padding: '8px', marginRight: '15px' }}
            />
            <label style={{ cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={mostrarSeleccionados}
                    onChange={(e) => setMostrarSeleccionados(e.target.checked)}
                /> Mostrar solo seleccionados
            </label>
        </div>
    );
}