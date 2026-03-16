type Listener = (...args: unknown[]) => void;

class SimpleEventEmitter {
  private listeners: Map<string, Listener[]> = new Map();

  on(event: string, fn: Listener): this {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
    return this;
  }

  off(event: string, fn?: Listener): this {
    if (!fn) {
      this.listeners.delete(event);
    } else {
      const fns = this.listeners.get(event);
      if (fns) this.listeners.set(event, fns.filter(f => f !== fn));
    }
    return this;
  }

  emit(event: string, ...args: unknown[]): this {
    const fns = this.listeners.get(event);
    if (fns) fns.forEach(fn => fn(...args));
    return this;
  }

  removeAllListeners(): this {
    this.listeners.clear();
    return this;
  }
}

// Мост между React и Phaser
export const EventBus = new SimpleEventEmitter();
