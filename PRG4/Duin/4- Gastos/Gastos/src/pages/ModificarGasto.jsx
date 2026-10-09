import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function ModificarGasto({ gastos, setGastos }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const gastoAModificar = gastos.find((g) => g.id == id);

  const [nombre, setNombre] = useState(gastoAModificar ? gastoAModificar.gasto : '');
  const [importe, setImporte] = useState(gastoAModificar ? gastoAModificar.importe : '');
  const [rubro, setRubro] = useState(gastoAModificar ? gastoAModificar.rubro : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !importe || !rubro || Number(importe) <= 0) return;

    setGastos(
      gastos.map((g) =>
        g.id == id
          ? { ...g, gasto: nombre.trim(), importe: Number(importe), rubro }
          : g
      )
    );

    navigate('/');
  };

  return (
    <div className="gastos-page">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Modificar Gasto #{id}
      </h2>

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

        <div className="btn-container" style={{ gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-enviar">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}