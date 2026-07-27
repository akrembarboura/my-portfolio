import { supabase } from '../../supabaseClient';
import type {
  HeroContent,
  AboutContent,
  SeoSettings,
  SiteSettings,
  Notification
} from '../types';

export async function fetchHero(): Promise<HeroContent | null> {
  const { data, error } = await supabase.from('hero_content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateHero(input: Partial<HeroContent>): Promise<HeroContent> {
  const { data, error } = await supabase
    .from('hero_content')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAbout(): Promise<AboutContent | null> {
  const { data, error } = await supabase.from('about_content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateAbout(input: Partial<AboutContent>): Promise<AboutContent> {
  const { data, error } = await supabase
    .from('about_content')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSeo(): Promise<SeoSettings | null> {
  const { data, error } = await supabase.from('seo_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSeo(input: Partial<SeoSettings>): Promise<SeoSettings> {
  const { data, error } = await supabase
    .from('seo_settings')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export const notificationsService = {
  async list(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return [];

    return data.map((lead: any) => ({
      id: lead.id,
      title: 'Nouveau Contact',
      message: `${lead.name} a envoyé une demande pour : ${lead.project_type || 'Projet divers'}`,
      read: lead.status !== 'new',
      type: 'message',
      time: lead.created_at
    }));
  },
  async markAllRead(): Promise<Notification[]> {
    await supabase
      .from('contact_messages')
      .update({ status: 'in_progress' })
      .eq('status', 'new');

    return this.list();
  },
  async markAsRead(id: string): Promise<Notification[]> {
    await supabase
      .from('contact_messages')
      .update({ status: 'in_progress' })
      .eq('id', id);

    return this.list();
  },
};

