import { supabase } from '../../supabaseClient';
import type { Service, ServiceInput } from '../types';

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createService(input: ServiceInput): Promise<Service> {
  const { data, error } = await supabase.from('services').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
