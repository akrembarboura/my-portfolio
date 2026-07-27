import { supabase } from '../../supabaseClient';
import type { Testimonial, TestimonialInput } from '../types';

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const { data, error } = await supabase.from('testimonials').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>
): Promise<Testimonial> {
  const { data, error } = await supabase
    .from('testimonials')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}
