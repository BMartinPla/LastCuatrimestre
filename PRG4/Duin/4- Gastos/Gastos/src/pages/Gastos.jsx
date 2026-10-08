import { useState } from 'react';

export function Gastos({ gastos, setGastos, nextId, setNextId }) {
  const [nombre, setNombre] = useState('');
  const [importe, setImporte] = useState('');
  const [rubro, setRubro] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !importe || !rubro) return;

    const nuevoGasto = {
        id: nextId,
        gasto: nombre.trim(),
        importe: parseFloat(importe),
        rubro: rubro,
    };

    setGastos([...gastos, nuevoGasto]);
    setNextId(nextId + 1);

    setNombre('');
    setImporte('');
    setRubro('');
  };

  const handleBorrar = (id) => {
    setGastos(gastos.filter((g) => g.id !== id));
  };

  return (
    <div className="gastos-page">
      <form onSubmit={handleSubmit} className="form-gastos">
        <input
          type="text"
          placeholder="Gasto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="$ 0,00"
          step="0.01"
          value={importe}
          onChange={(e) => setImporte(e.target.value)}
        />
        <select value={rubro} onChange={(e) => setRubro(e.target.value)}>
          <option value="">Seleccione</option>
          <option value="ALM">ALM (Almacen)</option>
          <option value="BEB">BEB (Bebidas)</option>
          <option value="SAL">SAL (Salidas)</option>
          <option value="COM">COM (Combustible)</option>
          <option value="LIM">LIM (Limpieza)</option>
        </select>

        <div className="btn-container">
          <button type="submit" className="btn-enviar">
            Enviar
          </button>
        </div>
      </form>

      <table className="tabla-gastos">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>id</th>
            <th style={{ width: '45%' }}>Gasto</th>
            <th style={{ width: '25%' }}>Importe</th>
            <th style={{ width: '15%' }}>Rubro</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {gastos.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-msg">
                No hay gastos registrados
              </td>
            </tr>
          ) : (
            gastos.map((g) => (
              <tr key={g.id} className="fila-resaltada">
                <td>{g.id}</td>
                <td>{g.gasto}</td>
                <td>${g.importe.toFixed(2)}</td>
                <td>{g.rubro}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleBorrar(g.id)}
                    className="btn-borrar-item"
                    title="Eliminar gasto"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}