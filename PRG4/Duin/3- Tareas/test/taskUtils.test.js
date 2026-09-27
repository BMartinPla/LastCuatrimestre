import test from 'node:test';
import assert from 'node:assert/strict';
import * as taskUtils from '../src/taskUtils.js';

test('description validation accepts only trimmed lengths from 3 to 60', () => {
  const valid = typeof taskUtils.isValidDescription === 'function'
    ? taskUtils.isValidDescription('  abc  ')
    : null;
  const tooShort = typeof taskUtils.isValidDescription === 'function'
    ? taskUtils.isValidDescription('ab')
    : null;
  const tooLong = typeof taskUtils.isValidDescription === 'function'
    ? taskUtils.isValidDescription('a'.repeat(61))
    : null;

  assert.equal(valid, true);
  assert.equal(tooShort, false);
  assert.equal(tooLong, false);
});

test('new tasks have a unique id, trimmed descripcion, and hecho false', () => {
  const first = typeof taskUtils.createTask === 'function'
    ? taskUtils.createTask('  Comprar pan  ')
    : null;
  const second = typeof taskUtils.createTask === 'function'
    ? taskUtils.createTask('Llamar')
    : null;

  assert.ok(first);
  assert.equal(first.descripcion, 'Comprar pan');
  assert.equal(first.hecho, false);
  assert.ok(first.id);
  assert.notEqual(first.id, second.id);
});

test('toggling a task changes only its hecho value without mutating the input', () => {
  const tasks = [
    { id: 'a', descripcion: 'Leer', hecho: false },
    { id: 'b', descripcion: 'Pagar', hecho: false },
  ];
  const updated = typeof taskUtils.toggleTask === 'function'
    ? taskUtils.toggleTask(tasks, 'a')
    : tasks;

  assert.deepEqual(updated.map((task) => task.hecho), [true, false]);
  assert.deepEqual(tasks.map((task) => task.hecho), [false, false]);
});

test('clearing completed tasks preserves pending tasks', () => {
  const tasks = [
    { id: 'a', descripcion: 'Leer', hecho: false },
    { id: 'b', descripcion: 'Pagar', hecho: true },
  ];
  const remaining = typeof taskUtils.removeCompleted === 'function'
    ? taskUtils.removeCompleted(tasks)
    : tasks;

  assert.deepEqual(remaining, [tasks[0]]);
});
