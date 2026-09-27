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
