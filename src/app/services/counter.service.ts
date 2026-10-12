import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SavedCounter } from '../models/saved-counter';
import { isSavedCounter } from '../utils/is-saved-counter';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly storageKey = 'saved-counters';
  private readonly countersState = signal<SavedCounter[]>([]);
  private readonly initializedState = signal(false);
  private readonly loadErrorState = signal<string | null>(null);
  private initializationPromise: Promise<void> | null = null;
  private pendingWrite: Promise<void> = Promise.resolve();

  readonly counters = this.countersState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly loadError = this.loadErrorState.asReadonly();

  initialize(): Promise<void> {
    this.initializationPromise ??= this.load();
    return this.initializationPromise;
  }

  async add(counter: SavedCounter): Promise<void> {
    if (!isSavedCounter(counter)) throw new Error('Neplatný záznam počítadla.');
    const copy = { ...counter };
    await this.initialize();
    return this.enqueueWrite(async () => {
      if (this.countersState().some((item) => item.id === copy.id)) {
        throw new Error('Záznam se stejným ID již existuje.');
      }
      const next = [copy, ...this.countersState()];
      await this.persist(next);
      this.countersState.set(next);
      this.loadErrorState.set(null);
    });
  }

  async remove(id: string): Promise<void> {
    await this.initialize();
    return this.enqueueWrite(async () => {
      const next = this.countersState().filter((counter) => counter.id !== id);
      await this.persist(next);
      this.countersState.set(next);
      this.loadErrorState.set(null);
    });
  }

  async clear(): Promise<void> {
    await this.initialize();
    return this.enqueueWrite(async () => {
      // Only remove our own key, never unrelated Preferences values.
      await Preferences.remove({ key: this.storageKey });
      this.countersState.set([]);
      this.loadErrorState.set(null);
    });
  }

  private enqueueWrite(operation: () => Promise<void>): Promise<void> {
    // Prevent a slower earlier write from overwriting a newer saved state.
    const result = this.pendingWrite.then(operation);
    // Let later operations continue even after one failed write.
    this.pendingWrite = result.catch(() => undefined);
    return result;
  }

  private async load(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.storageKey });
      if (value === null) {
        this.countersState.set([]);
        return;
      }
      const parsed: unknown = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        throw new Error('Uložená historie nemá očekávaný formát pole.');
      }
      if (!parsed.every(isSavedCounter)) {
        throw new Error('Některý uložený záznam má neplatný formát.');
      }
      const ids = new Set(parsed.map((counter) => counter.id));
      if (ids.size !== parsed.length) throw new Error('Historie obsahuje duplicitní ID.');
      this.countersState.set(parsed);
    } catch (error) {
      console.error('Historii počítadel se nepodařilo načíst.', error);
      this.countersState.set([]);
      this.loadErrorState.set('Historii se nepodařilo načíst. Může být poškozená nebo nedostupná.');
    } finally {
      this.initializedState.set(true);
    }
  }

  private async persist(counters: SavedCounter[]): Promise<void> {
    await Preferences.set({ key: this.storageKey, value: JSON.stringify(counters) });
  }
}
