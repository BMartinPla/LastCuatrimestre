import { createContext, useContext, useState } from 'react';
import { z } from 'zod';

export const gastoSchema = z.object({
  gasto: z.string().trim().min(1, 'El gasto es obligatorio'),
  importe: z
    .coerce
    .number({ invalid_type_error: 'Debe ingresar un importe válido' })
    .positive('El importe debe ser mayor a 0'),
  rubro: z.string().min(1, 'Debe seleccionar un rubro'),
});

const GastosContext = createContext();

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [ultimoId, setUltimoId] = useState(null);

  const agregarGasto = (datos) => {
    const nuevo = {
      id: nextId,
      gasto: datos.gasto.trim(),
      importe: datos.importe,
      rubro: datos.rubro,
    };

    // 1. Agrega el nuevo gasto al inicio de la lista
    setGastos((prevGastos) => [nuevo, ...prevGastos]);

    // 2. Guarda este ID como el último ingresado (para resaltarlo en celeste)
    setUltimoId(nextId);

    // 3. Incrementa el contador para el próximo
    setNextId((prevId) => prevId + 1);
  };

  const modificarGasto = (id, datos) => {
    setGastos((prev) =>
      prev.map((g) =>
        g.id == id
          ? { ...g, gasto: datos.gasto.trim(), importe: datos.importe, rubro: datos.rubro }
          : g
      )
    );
  };

  const eliminarGasto = (id) => {
    // Number(id) garantiza que coincida con el id numérico del objeto
    setGastos((prev) => prev.filter((g) => g.id !== Number(id)));
    setUltimoId((prev) => (prev === Number(id) ? null : prev));
  };

  return (
    <GastosContext.Provider
      value={{ gastos, ultimoId, agregarGasto, modificarGasto, eliminarGasto }}
    >
      {children}
    </GastosContext.Provider>
  );
}

export const useGastos = () => useContext(GastosContext);