import { useCallback, useEffect, useState } from 'react';
import type { Repository } from '../services/repository';
import type { Timestamped } from '../types';
import { useToast } from './useToast';

/**
 * Data-fetching + mutation hook bound to a repository. Handles loading, errors,
 * optimistic refresh and success toasts so pages stay declarative.
 */
export function useCollection<T extends Timestamped, Input>(
  repo: Repository<T, Input>,
  labels: { entity: string }
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repo.list();
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: Input) => {
      try {
        const created = await repo.create(input);
        setItems((prev) => [created, ...prev]);
        success(`${labels.entity} créé`, 'Enregistrement ajouté avec succès.');
        return created;
      } catch (err) {
        toastError('Échec de la création', (err as Error).message);
        throw err;
      }
    },
    [repo, labels.entity, success, toastError]
  );

  const update = useCallback(
    async (id: string, input: Partial<Input>) => {
      try {
        const updated = await repo.update(id, input);
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
        success(`${labels.entity} mis à jour`, 'Modifications enregistrées.');
        return updated;
      } catch (err) {
        toastError('Échec de la mise à jour', (err as Error).message);
        throw err;
      }
    },
    [repo, labels.entity, success, toastError]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await repo.remove(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
        success(`${labels.entity} supprimé`, 'Enregistrement supprimé.');
      } catch (err) {
        toastError('Échec de la suppression', (err as Error).message);
        throw err;
      }
    },
    [repo, labels.entity, success, toastError]
  );

  const reorder = useCallback(
    async (orderedIds: string[]) => {
      // Optimistic update.
      setItems((prev) => {
        const byId = new Map(prev.map((i) => [i.id, i]));
        return orderedIds
          .map((id) => byId.get(id))
          .filter(Boolean) as T[];
      });
      try {
        const next = await repo.reorder(orderedIds);
        setItems(next);
      } catch (err) {
        toastError('Échec du réordonnancement', (err as Error).message);
        refresh();
      }
    },
    [repo, toastError, refresh]
  );

  return {
    items,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    reorder,
    setItems,
  };
}
