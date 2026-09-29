import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
    
    const [tareas, setTareas] = useState([]);
    const [texto, setTexto] = useState('');
    const [nextId, setNextId] = useState(1);

    const esValido = texto.trim().length >= 3 && texto.trim().length <= 60;

    const agregarTarea = (e) => {
        e.preventDefault();
        if (!esValido) return;

        const nuevaTarea = {
            id: nextId,
            descripcion: texto.trim(),
            hecho: false,
        };

        setTareas([...tareas, nuevaTarea]);
        setNextId(nextId + 1);
        setTexto('');
    }

    const alternarEstado = (id) => {
        setTareas(
            tareas.map((t) => (t.id == id ? { ...t, hecho: !t.hecho } : t))
        );
    };

    const eliminarRealizadas = () => {
        setTareas(tareas.filter((t) => !t.hecho));
    };

    const pendientes = tareas.filter((t) => !t.hecho);
    const realizadas = tareas.filter((t) => t.hecho);

  return (
      <>
          <div className="container">
              *Formulario de Ingreso*
              <form onSubmit={agregarTarea} className="input-group">
                  <input type="text" placeholder="Ingrese tarea" value={texto} maxLength={60} onChange={(e) => setTexto(e.target.value)} />
                  <button type="submit" disabled={!esValido} className="btn-send">Enviar</button>
              </form>

              {/* Sección: Tareas Pendientes */}
              <section className="section">
                  <h3 className="section-title">Tareas Pendientes</h3>
                  <table className="task-table">
                      <thead>
                          <tr>
                              <th className="th-desc">Tarea</th>
                              <th className="th-center">Hecho</th>
                              <th className="th-center">Id</th>
                          </tr>
                      </thead>
                      <tbody>
                          {pendientes.length === 0 ? (
                              <tr>
                                  <td colSpan="3" className="empty-msg">No hay tareas pendientes</td>
                              </tr>
                          ) : (
                              pendientes.map((tarea) => (
                                  <tr key={tarea.id}>
                                      <td>{tarea.descripcion}</td>
                                      <td className="td-center">
                                          <input
                                              type="checkbox"
                                              checked={tarea.hecho}
                                              onChange={() => alternarEstado(tarea.id)}
                                          />
                                      </td>
                                      <td className="td-center">{tarea.id}</td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </section>

              {/* Sección: Tareas Realizadas */}
              <section className="section">
                <div className="section-header">
                    <h3 className="section-title">Tareas Realizadas</h3>
                    <button type="button" onClick={eliminarRealizadas} className="btn-eliminar" disabled={realizadas.length === 0}>Eliminar</button>
                </div>

                <table className="task-table">
                    <thead>
                        <tr>
                            <th className="th-desc">Tareas</th>
                            <th className="th-center">Hecho</th>
                            <th className="th-center">Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {realizadas.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="empty-msg">No hay tareas realizadas</td>
                        </tr>
                        ) : (
                            realizadas.map((tarea) => (
                                <tr key={tarea.id}>
                                    <td>{tarea.descripcion}</td>
                                    <td className="td-center">
                                        <input type="checkbox" checked={tarea.hecho} onChange={() => alternarEstado(tarea.id)}/>
                                    </td>
                                    <td className="td-center">{tarea.id}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
              </section>

          </div>
    </>
  )
}

export default App
