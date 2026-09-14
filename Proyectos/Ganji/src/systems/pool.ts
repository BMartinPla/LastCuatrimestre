export class Pool<T> {
  private items: T[] = [];
  private factory: () => T;
  private reset: (item: T) => void;

  constructor(factory: () => T, reset: (item: T) => void, prefill = 0) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < prefill; i++) {
      this.items.push(factory());
    }
  }

  acquire(): T {
    const item = this.items.pop();
    return item !== undefined ? item : this.factory();
  }

  release(item: T): void {
    this.reset(item);
    this.items.push(item);
  }

  get available(): number {
    return this.items.length;
  }
}
