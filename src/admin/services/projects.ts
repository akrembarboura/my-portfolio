import { supabase } from '../../supabaseClient';
import type { Project, ProjectInput } from '../types';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase.from('projects').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
