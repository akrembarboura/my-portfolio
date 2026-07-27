import { supabase } from '../../supabaseClient';
import type { MediaItem, MediaItemInput } from '../types';

export async function fetchMedia(folder?: string): Promise<MediaItem[]> {
  let query = supabase.from('media_items').select('*').order('created_at', { ascending: false });
  if (folder && folder !== 'all') query = query.eq('folder', folder);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as MediaItem[];
}

export async function createMediaItem(input: MediaItemInput): Promise<MediaItem> {
  const { data, error } = await supabase.from('media_items').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function createMediaItems(inputs: MediaItemInput[]): Promise<MediaItem[]> {
  const { data, error } = await supabase.from('media_items').insert(inputs).select();
  if (error) throw error;
  return data ?? [];
}

export async function updateMediaItem(id: string, input: Partial<MediaItemInput>): Promise<MediaItem> {
  const { data, error } = await supabase
    .from('media_items')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMediaItem(id: string): Promise<void> {
  const { error } = await supabase.from('media_items').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  return data.publicUrl;
}
