/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events';

export class ServerEventManager<
  Events extends Record<string, (...args: any[]) => void>
> extends EventEmitter {
  subscribe<K extends keyof Events>(event: K, listener: Events[K]) {
    return super.on(event as string, listener);
  }
  publish<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
    return super.emit(event as string, ...args);
  }
}
