import { supabase } from '../../supabaseClient';
import type { Lead, LeadStatus, LeadUpdate } from '../types';

export async function fetchLeads(): Promise<Lead[]> {
  try {
    console.log('1. Starting fetchLeads...');
    console.log('2. Supabase instance check:', supabase);

    const response = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('3. Raw Supabase response:', response);

    if (response.error) {
      console.error('4. Database rejected request:', response.error);
      throw response.error;
    }

    const formattedData = (response.data ?? []).map((row) => ({
      ...row,
      status: (row.status ?? 'new') as LeadStatus,
    }));

    console.log('5. Data successfully formatted:', formattedData);
    return formattedData;

  } catch (err) {
    console.error('🔥 CRITICAL FAILURE in fetchLeads:', err);
    throw err;
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from('contact_messages').update({ status } satisfies LeadUpdate).eq('id', id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}
