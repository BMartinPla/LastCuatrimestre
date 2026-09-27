# Lista de tareas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the exercise 3 personal task manager as a small React-JSX-Vite app.

**Architecture:** A standalone Vite app directly in `PRG4/Duin/3- Tareas`. React `useState` owns the in-memory task list and form; a tiny pure helper module contains task validation/transforms so it can be tested with Node's built-in test runner. One screen renders the form and the pending/completed tables.

**Tech Stack:** React 18, JSX, Vite 6.4.3, plain CSS, Node `node:test` (no test libraries).

**Spec:** `docs/superpowers/specs/2026-09-27-lista-tareas-design.md`

## Global Constraints

- Use React + JSX + Vite in `PRG4/Duin/3- Tareas`.
- A task description has 3–60 characters after trimming.
- Enable task submission from 3 characters; submit by button or Enter.
- New tasks have a unique ID and `hecho: false`.
- Show separate pending and completed tables; checkboxes toggle status; the completed group has a clear-all button.
- Keep tasks in React memory only; no backend or persistence.
- Use a native controlled form and `useState`; add no form libraries or routes.

---

### Task 1: Bootstrap the Vite app and test task operations

**Files:**
- Create: `PRG4/Duin/3- Tareas/package.json`
- Create: `PRG4/Duin/3- Tareas/index.html`
- Create: `PRG4/Duin/3- Tareas/vite.config.js`
- Create: `PRG4/Duin/3- Tareas/src/App.jsx`
- Create: `PRG4/Duin/3- Tareas/src/main.jsx`
- Create: `PRG4/Duin/3- Tareas/src/index.css`
- Create: `PRG4/Duin/3- Tareas/src/taskUtils.js`
- Create: `PRG4/Duin/3- Tareas/test/taskUtils.test.js`
- Create: `PRG4/Duin/3- Tareas/.gitignore`
- Create by install: `PRG4/Duin/3- Tareas/package-lock.json`

**Interfaces:**
- Produces `isValidDescription(value)`, `createTask(description)`, `toggleTask(tasks, id)`, and `removeCompleted(tasks)` from `src/taskUtils.js`.
- `createTask` returns `{ id, descripcion, hecho }`; the ID comes from `crypto.randomUUID()`.
- `toggleTask` and `removeCompleted` return new arrays and do not mutate their inputs.

- [ ] **Step 1: Create the manifest and install only runtime/build dependencies**

Run from `PRG4/Duin/3- Tareas`:

```sh
npm init -y
npm install react@^18.3.1 react-dom@^18.3.1
npm install -D vite@^6.4.3 @vitejs/plugin-react-swc@^3.5.0
```

Set `"type": "module"` and these exact scripts in `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "node --test"
}
```

- [ ] **Step 2: Write failing tests for task helpers**

Create the `src` and `test` folders, then create `test/taskUtils.test.js` with these tests using `node:test` and `node:assert/strict`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidDescription,
  createTask,
  toggleTask,
  removeCompleted,
} from '../src/taskUtils.js';

test('description accepts trimmed lengths from 3 through 60', () => {
  assert.equal(isValidDescription('  abc  '), true);
  assert.equal(isValidDescription('a'.repeat(60)), true);
  assert.equal(isValidDescription('ab'), false);
  assert.equal(isValidDescription('a'.repeat(61)), false);
  assert.equal(isValidDescription('   '), false);
});

test('createTask trims text and sets a unique id and pending status', () => {
  const first = createTask('  Comprar pan  ');
  const second = createTask('Llamar');
  assert.equal(first.descripcion, 'Comprar pan');
  assert.equal(first.hecho, false);
  assert.ok(first.id);
  assert.notEqual(first.id, second.id);
});

test('toggleTask changes only the matching task without mutating its input', () => {
  const tasks = [
    { id: 'a', descripcion: 'Leer', hecho: false },
    { id: 'b', descripcion: 'Pagar', hecho: false },
  ];
  const updated = toggleTask(tasks, 'a');
  assert.deepEqual(updated.map((task) => task.hecho), [true, false]);
  assert.deepEqual(tasks.map((task) => task.hecho), [false, false]);
});

test('removeCompleted keeps pending tasks only', () => {
  const tasks = [
    { id: 'a', descripcion: 'Leer', hecho: false },
    { id: 'b', descripcion: 'Pagar', hecho: true },
  ];
  assert.deepEqual(removeCompleted(tasks), [tasks[0]]);
});
```

- [ ] **Step 3: Run the tests and confirm they fail because the helper module is missing**

Run: `npm test`
Expected: FAIL with module-not-found for `src/taskUtils.js`.

- [ ] **Step 4: Implement the pure helper functions**

Create `src/taskUtils.js`:

```js
export function isValidDescription(value) {
  const description = value.trim();
  return description.length >= 3 && description.length <= 60;
}

export function createTask(description) {
  return {
    id: crypto.randomUUID(),
    descripcion: description.trim(),
    hecho: false,
  };
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, hecho: !task.hecho } : task,
  );
}

export function removeCompleted(tasks) {
  return tasks.filter((task) => !task.hecho);
}
```

- [ ] **Step 5: Add the minimum Vite entry files and ignore generated files**

Create `index.html` with a `#root` element and `/src/main.jsx` module script:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lista de tareas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Create `src/main.jsx` to render `<App />` from `./App.jsx` and import `./index.css`:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
);
```

Create `vite.config.js` with `defineConfig` and the SWC React plugin:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({ plugins: [react()] });
```

Add `node_modules/` and `dist/` to `.gitignore`. For this task, create a temporary minimal `src/App.jsx` that renders `<main><h1>Lista de tareas</h1></main>` and an empty `src/index.css`; the next task replaces the app and styles.

- [ ] **Step 6: Run helper tests and production build**

Run: `npm test`
Expected: 4 tests pass.

Run: `npm run build`
Expected: Vite creates `dist/` with no errors.

### Task 2: Build the task form, tables, and responsive styling

**Files:**
- Create/Modify: `PRG4/Duin/3- Tareas/src/App.jsx`
- Create: `PRG4/Duin/3- Tareas/src/App.css`
- Create: `PRG4/Duin/3- Tareas/src/index.css`

**Interfaces:**
- Consumes the four exports from `src/taskUtils.js`.
- `App` owns `description` and `tasks` with `useState`; no state escapes this screen.

- [ ] **Step 1: Replace the placeholder with a controlled form and task groups**

Implement `App.jsx` with this component structure and behavior:

```jsx
import { useState } from 'react';
import {
  createTask,
  isValidDescription,
  removeCompleted,
  toggleTask,
} from './taskUtils.js';
import './App.css';

function TaskTable({ title, tasks, onToggle, action }) {
  return (
    <section className="task-section">
      <div className="section-heading">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tarea</th><th>Hecha</th><th>ID</th></tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan="3">No hay tareas {title.toLowerCase()}.</td></tr>
            ) : tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.descripcion}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={task.hecho}
                    aria-label={`Marcar como realizada: ${task.descripcion}`}
                    onChange={() => onToggle(task.id)}
                  />
                </td>
                <td>{task.id}</td>
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
        <p>Un paso a la vez: registra y completa tus pendientes.</p>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="task-description">Nueva tarea</label>
        <div className="form-row">
          <input
            id="task-description"
            value={description}
            maxLength={60}
            placeholder="¿Qué necesitas hacer?"
            onChange={(event) => setDescription(event.target.value)}
          />
          <button type="submit" disabled={!canSubmit}>Agregar tarea</button>
        </div>
        <p className="character-count">{description.trim().length}/60 · mínimo 3 caracteres</p>
      </form>

      <TaskTable title="Tareas pendientes" tasks={pendingTasks} onToggle={handleToggle} />
      <TaskTable
        title="Tareas realizadas"
        tasks={completedTasks}
        onToggle={handleToggle}
        action={(
          <button
            type="button"
            className="button-secondary"
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
```

Use a native form so Enter triggers the same submit handler as the button. The input's `maxLength` prevents typing more than 60 characters; `isValidDescription` gates enabling and actual creation. The completed list uses a second `TaskTable`, and its clear-all button uses a functional state update.

- [ ] **Step 2: Add global styles and component styles**

Set global box sizing, a readable system font, page background, zero body margin, and a visible keyboard focus ring in `index.css`. In `App.css`, give the main content a centered max-width, style the form and buttons, use full-width collapsed-border tables, and add a narrow-screen rule so tables can scroll horizontally without breaking the page. Keep visual decoration restrained. Example responsive table treatment:

```css
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; }
th:nth-child(2), td:nth-child(2) { width: 90px; text-align: center; }
@media (max-width: 560px) {
  .app-shell { width: min(100% - 24px, 760px); }
  .form-row { align-items: stretch; flex-direction: column; }
  .table-wrap { margin-inline: -4px; }
}
```

- [ ] **Step 3: Run the automated helper test suite and build**

Run: `npm test`
Expected: all 4 task helper tests pass.

Run: `npm run build`
Expected: Vite builds the full app without errors.

- [ ] **Step 4: Manually verify the required interactions in the browser**

Run: `npm run dev -- --host 127.0.0.1`, then verify:

1. The add button is disabled for 0–2 trimmed characters and enabled from 3–60.
2. A 61st character cannot be typed; a valid description adds with both button click and Enter.
3. New items appear in Pending with a unique visible ID and unchecked `Hecha` checkbox; the input clears.
4. Checking an item moves it to Completed; unchecking moves it back to Pending.
5. “Eliminar realizadas” removes completed rows and is disabled when there are none.
6. Both sections display a clear empty state when they have no items; layout stays usable at a narrow viewport.

Stop the dev server after verification.

---

## Self-review

- Spec coverage: creation, 3–60 validation, Enter submission, unique ID and pending default, two task groups, checkbox status changes, and bulk completed-task deletion are covered in Tasks 1–2. In-memory-only state and no routes or form dependencies are preserved.
- Placeholder scan: no TODO/TBD or undefined product decisions remain; file paths, helper signatures, test cases, commands, and expected results are stated.
- Type/field consistency: helpers, tests, and UI consistently use `{ id, descripcion, hecho }`; the JavaScript property name has no accent.
