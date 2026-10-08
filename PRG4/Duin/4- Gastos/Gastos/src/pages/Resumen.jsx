export function Resumen({ gastos }) {
  let totalGeneral = 0;
  gastos.forEach((g) => {
    totalGeneral += Number(g.importe);
  });

  const totalesPorRubro = {};
  gastos.forEach((g) => {
    if (!totalesPorRubro[g.rubro]) {
      totalesPorRubro[g.rubro] = 0;
    }
    totalesPorRubro[g.rubro] += Number(g.importe);
  });

  const filasResumen = Object.entries(totalesPorRubro).map(([rubro, total]) => {
    const porcentaje = totalGeneral > 0 ? (total / totalGeneral) * 100 : 0;
    return {
      rubro,
      total,
      porcentaje: porcentaje.toFixed(2),
    };
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
          {filasResumen.length === 0 ? (
            <tr>
              <td colSpan="3" className="empty-msg">
                No hay gastos para resumir
              </td>
            </tr>
          ) : (
            filasResumen.map((fila) => (
              <tr key={fila.rubro}>
                <td>{fila.rubro}</td>
                <td style={{ textAlign: 'right' }}>
                  $ {fila.total.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right' }}>{fila.porcentaje}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}