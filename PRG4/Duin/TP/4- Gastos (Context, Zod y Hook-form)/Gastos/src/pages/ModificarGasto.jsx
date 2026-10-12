import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGastos, gastoSchema } from '../context/GastosContext';

export function ModificarGasto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { gastos, modificarGasto, eliminarGasto } = useGastos();

  const gastoAEditar = gastos.find((g) => g.id == id);

  // 'values' precarga el form reactivamente sin necesidad de useEffect
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(gastoSchema),
    values: gastoAEditar,
  });

  if (!gastoAEditar) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p>Gasto no encontrado.</p>
        <Link to="/">Volver</Link>
      </div>
    );
  }

  const onSubmit = (data) => {
    modificarGasto(id, data);
    navigate('/');
  };

  const handleEliminar = () => {
    eliminarGasto(id);
    navigate('/');
  };

  return (
    <div className="gastos-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Modificar Gasto #{id}</h2>
        <Link to="/" title="Volver al ingreso inicial" style={{ fontSize: '1.4rem', textDecoration: 'none' }}>
          ↩️
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-gastos">
        <input type="text" placeholder="Gasto" {...register('gasto')} />
        <input type="number" step="0.01" placeholder="$ 0.0" {...register('importe')} />
        <select {...register('rubro')}>
          <option value="">Seleccione</option>
          <option value="ALM">ALM</option>
          <option value="BEB">BEB</option>
          <option value="SAL">SAL</option>
          <option value="COM">COM</option>
          <option value="LIM">LIM</option>
        </select>

        <div className="btn-container" style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-enviar">Enviar</button>
          <button type="button" onClick={handleEliminar} className="btn-eliminar" style={{ background: '#dc3545', color: '#fff' }}>
            Eliminar
          </button>
        </div>
      </form>
    </div>
  );
}