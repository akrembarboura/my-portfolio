import type { Timestamped } from '../types';
import { uid } from '../utils/uid';
import { delay, readCollection, writeCollection } from './store';

/**
 * Generic CRUD repository over the local store. Every entity service is a thin
 * wrapper around this factory. To migrate to Supabase, replace the internals of
 * these methods with Supabase queries — the signatures stay identical.
 */
export interface Repository<T extends Timestamped, Input> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(input: Input): Promise<T>;
  update(id: string, input: Partial<Input>): Promise<T>;
  remove(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<T[]>;
}

export function createRepository<T extends Timestamped, Input>(
  name: string,
  seed: T[],
  idPrefix = ''
): Repository<T, Input> {
  return {
    async list() {
      const rows = readCollection<T>(name, seed);
      return delay([...rows]);
    },

    async get(id) {
      const rows = readCollection<T>(name, seed);
      return delay(rows.find((r) => r.id === id));
    },

    async create(input) {
      const rows = readCollection<T>(name, seed);
      const timestamp = new Date().toISOString();
      const record = {
        ...(input as object),
        id: uid(idPrefix),
        createdAt: timestamp,
        updatedAt: timestamp,
      } as T;
      const next = [record, ...rows];
      writeCollection(name, next);
      return delay(record);
    },

    async update(id, input) {
      const rows = readCollection<T>(name, seed);
      let updated: T | undefined;
      const next = rows.map((r) => {
        if (r.id !== id) return r;
        updated = {
          ...r,
          ...(input as object),
          updatedAt: new Date().toISOString(),
        } as T;
        return updated;
      });
      writeCollection(name, next);
      if (!updated) throw new Error(`Enregistrement introuvable: ${id}`);
      return delay(updated);
    },

    async remove(id) {
      const rows = readCollection<T>(name, seed);
      writeCollection(
        name,
        rows.filter((r) => r.id !== id)
      );
      return delay(undefined);
    },

    async reorder(orderedIds) {
      const rows = readCollection<T>(name, seed);
      const byId = new Map(rows.map((r) => [r.id, r]));
      const reordered = orderedIds
        .map((id, index) => {
          const row = byId.get(id);
          if (!row) return undefined;
          return { ...row, order: index + 1 } as T & { order: number };
        })
        .filter(Boolean) as T[];
      // Keep any rows not present in orderedIds at the end.
      const remaining = rows.filter((r) => !orderedIds.includes(String(r.id)));
      const next = [...reordered, ...remaining];
      writeCollection(name, next);
      return delay(next);
    },
  };
}
