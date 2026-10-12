import { useGastos } from '../context/GastosContext';

export function Resumen() {
  const { gastos } = useGastos();

  const totalGeneral = gastos.reduce((acc, g) => acc + g.importe, 0);

  const totalesPorRubro = {};
  gastos.forEach((g) => {
    totalesPorRubro[g.rubro] = (totalesPorRubro[g.rubro] || 0) + g.importe;
  });

  return (
    <div className="resumen-page">
      <table className="tabla-resumen">
        <thead>
          <tr>
            <th>Rubro</th>
            <th style={{ textAlign: 'right' }}>Total</th>
            <th style={{ textAlign: 'right' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(totalesPorRubro).length === 0 ? (
            <tr><td colSpan="3" className="empty-msg">No hay gastos para resumir</td></tr>
          ) : (
            Object.entries(totalesPorRubro).map(([rubro, total]) => (
              <tr key={rubro}>
                <td>{rubro}</td>
                <td style={{ textAlign: 'right' }}>${total.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>
                  {totalGeneral > 0 ? ((total / totalGeneral) * 100).toFixed(2) : 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}