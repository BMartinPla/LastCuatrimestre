import './PersonasFiltro.css';

export default function PersonasFiltro({
    busqueda,
    setBusqueda,
    mostrarSeleccionados,
    setMostrarSeleccionados
}) {
    return (
        <div className="people-filter">
            <input
                type="text"
                placeholder="Buscar por nombre o apellido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
            />
            <label className="selected-filter">
                <input
                    type="checkbox"
                    checked={mostrarSeleccionados}
                    onChange={(e) => setMostrarSeleccionados(e.target.checked)}
                /> Mostrar solo seleccionados
            </label>
        </div>
    );
}
