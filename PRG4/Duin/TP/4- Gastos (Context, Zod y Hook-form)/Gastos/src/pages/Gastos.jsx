import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGastos, gastoSchema } from '../context/GastosContext';

export function Gastos() {
  const { gastos, ultimoId, agregarGasto } = useGastos();
  const [alerta, setAlerta] = useState(false);

  // Inicialización de React Hook Form con el validador de Zod
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gastoSchema),
    defaultValues: { gasto: '', importe: '', rubro: '' },
  });

  watch();

  // Autocierre opcional de la alerta flotante después de 3 segundos
  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => setAlerta(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  // Se ejecuta únicamente si Zod valida que todo está correcto
  const onSubmit = (data) => {
    agregarGasto(data);
    reset({ gasto: '', importe: '', rubro: '' }); // Limpia los inputs
    setAlerta(true); // Dispara la notificación flotante
  };

  return (
    <div className="gastos-page">
      {/* 1. Notificación Flotante (Verde en la parte superior) */}
      {alerta && (
        <div className="notificacion-flotante">
          <div className="notificacion-contenido">
            <span className="notificacion-check">✔</span>
            <span>Ingresado.</span>
          </div>
          <button
            type="button"
            className="notificacion-cerrar"
            onClick={() => setAlerta(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Formulario conectado con React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form-gastos" autoComplete="off">
        <div className="campo-form">
          <input
            type="text"
            placeholder="Gasto"
            {...register('gasto')}
          />
          {errors.gasto && <span className="error-texto">{errors.gasto.message}</span>}
        </div>

        <div className="campo-form">
          <input
            type="number"
            step="any"
            placeholder="$ 0.0"
            {...register('importe')}
          />
          {errors.importe && <span className="error-texto">{errors.importe.message}</span>}
        </div>

        <div className="campo-form">
          <select {...register('rubro')}>
            <option value="">Seleccione</option>
            <option value="ALM">ALM</option>
            <option value="BEB">BEB</option>
            <option value="SAL">SAL</option>
            <option value="COM">COM</option>
            <option value="LIM">LIM</option>
          </select>
          {errors.rubro && <span className="error-texto">{errors.rubro.message}</span>}
        </div>

        <div className="btn-container">
          <button type="submit" className="btn-enviar">
            Enviar
          </button>
        </div>
      </form>

      {/* 3. Tabla con resaltado únicamente en el último gasto agregado */}
      <table className="tabla-gastos">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>id</th>
            <th style={{ width: '42%' }}>Gasto</th>
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
              <tr
                key={g.id}
                className={g.id === ultimoId ? 'fila-resaltada' : ''}
              >
                <td>{g.id}</td>
                <td>{g.gasto}</td>
                <td>${g.importe.toFixed(2)}</td>
                <td>{g.rubro}</td>
                <td style={{ textAlign: 'center' }}>
                  {/* Ícono de edición que navega a la pantalla completa */}
                  <Link
                    to={`/modificar/${g.id}`}
                    title="Modificar gasto"
                    style={{ textDecoration: 'none', fontSize: '1.2rem' }}
                  >
                    📝
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}