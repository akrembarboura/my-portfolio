import { supabase } from '../../supabaseClient';
import type { Timestamped } from '../types';

export interface Repository<T extends Timestamped, Input> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(input: Input): Promise<T>;
  update(id: string, input: Partial<Input>): Promise<T>;
  remove(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<T[]>;
}

export function createSupabaseRepository<T extends Timestamped, Input>(tableName: string): Repository<T, Input> {
  return {
    async list(): Promise<T[]> {
      const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as T[];
    },

    async get(id: string): Promise<T | undefined> {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as T | undefined;
    },

    async create(input: Input): Promise<T> {
      const { data, error } = await supabase.from(tableName).insert(input).select().single();
      if (error) throw error;
      return data as T;
    },

    async update(id: string, input: Partial<Input>): Promise<T> {
      const { data, error } = await supabase
        .from(tableName)
        .update(input as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as T;
    },

    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },

    async reorder(orderedIds: string[]): Promise<T[]> {
      return [];
    },
  };
}
