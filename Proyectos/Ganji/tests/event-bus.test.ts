import { describe, expect, it } from 'vitest';
import { EventBus } from '../src/systems/event-bus';

describe('EventBus', () => {
  it('emite y recibe con payload tipado', () => {
    const bus = new EventBus();
    const received: number[] = [];
    bus.on('gold-changed', (p) => received.push(p.gold));
    bus.emit('gold-changed', { gold: 42 });
    expect(received).toEqual([42]);
  });

  it('off y unsubscribe detienen la escucha', () => {
    const bus = new EventBus();
    let count = 0;
    const handler = (): void => {
      count += 1;
    };
    const unsubscribe = bus.on('player-hurt', handler);
    bus.emit('player-hurt', { amount: 5 });
    unsubscribe();
    bus.emit('player-hurt', { amount: 5 });
    expect(count).toBe(1);

    const h2 = (): void => {
      count += 10;
    };
    bus.on('player-hurt', h2);
    bus.off('player-hurt', h2);
    bus.emit('player-hurt', { amount: 1 });
    expect(count).toBe(1);
  });

  it('clear elimina todo', () => {
    const bus = new EventBus();
    let count = 0;
    bus.on('victory', () => {
      count += 1;
    });
    bus.clear();
    bus.emit('victory', { elapsed: 1, kills: 1, level: 1, gold: 1 });
    expect(count).toBe(0);
  });
});
