import { useState } from 'react';
import {
  createTask,
  isValidDescription,
  removeCompleted,
  toggleTask,
} from './taskUtils.js';
import './App.css';

function TaskTable({ title, tasks, onToggle, action }) {
  const headingId = `${title.toLowerCase().replaceAll(' ', '-')}-heading`;

  return (
    <section className="task-section" aria-labelledby={headingId}>
      <div className="section-heading">
        <h2 id={headingId}>{title}</h2>
        {action}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Tarea</th>
              <th scope="col">Hecha</th>
              <th scope="col">ID</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td className="empty-state" colSpan="3">
                  Aún no hay tareas.
                </td>
              </tr>
            ) : tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.descripcion}</td>
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={task.hecho}
                    aria-label={`Marcar como realizada: ${task.descripcion}`}
                    onChange={() => onToggle(task.id)}
                  />
                </td>
                <td className="task-id">{task.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function App() {
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const pendingTasks = tasks.filter((task) => !task.hecho);
  const completedTasks = tasks.filter((task) => task.hecho);
  const canSubmit = isValidDescription(description);

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    setTasks((current) => [...current, createTask(description)]);
    setDescription('');
  }

  function handleToggle(id) {
    setTasks((current) => toggleTask(current, id));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Organización personal</p>
        <h1>Lista de tareas</h1>
        <p className="intro">Un paso a la vez: registra y completa tus pendientes.</p>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="task-description">Nueva tarea</label>
        <div className="form-row">
          <input
            id="task-description"
            type="text"
            value={description}
            required
            minLength={3}
            maxLength={60}
            aria-describedby="description-help"
            placeholder="¿Qué necesitas hacer?"
            onChange={(event) => setDescription(event.target.value)}
          />
          <button className="button button--primary" type="submit" disabled={!canSubmit}>
            Agregar tarea
          </button>
        </div>
        <p className="character-count" id="description-help">
          {description.trim().length}/60 · mínimo 3 caracteres
        </p>
      </form>

      <TaskTable
        title="Tareas pendientes"
        tasks={pendingTasks}
        onToggle={handleToggle}
      />
      <TaskTable
        title="Tareas realizadas"
        tasks={completedTasks}
        onToggle={handleToggle}
        action={(
          <button
            className="button button--secondary"
            type="button"
            disabled={completedTasks.length === 0}
            onClick={() => setTasks((current) => removeCompleted(current))}
          >
            Eliminar realizadas
          </button>
        )}
      />
    </main>
  );
}
