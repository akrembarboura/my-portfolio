import { supabase } from '../../supabaseClient';
import type { PortfolioImage, PortfolioImageInput } from '../types';

export async function fetchPortfolio(): Promise<PortfolioImage[]> {
  const { data, error } = await supabase
    .from('portfolio_images')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPortfolioImage(input: PortfolioImageInput): Promise<PortfolioImage> {
  const { data, error } = await supabase.from('portfolio_images').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function createPortfolioImages(inputs: PortfolioImageInput[]): Promise<PortfolioImage[]> {
  const { data, error } = await supabase.from('portfolio_images').insert(inputs).select();
  if (error) throw error;
  return data ?? [];
}

export async function updatePortfolioImage(
  id: string,
  input: Partial<PortfolioImageInput>
): Promise<PortfolioImage> {
  const { data, error } = await supabase
    .from('portfolio_images')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePortfolioImage(id: string): Promise<void> {
  const { error } = await supabase.from('portfolio_images').delete().eq('id', id);
  if (error) throw error;
}
