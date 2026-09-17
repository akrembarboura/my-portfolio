import type { ContactRequest, ContactRequestInput } from '../types';
import { createSupabaseRepository } from './supabaseRepository';

export const contactsService = createSupabaseRepository<
  ContactRequest,
  ContactRequestInput
>('contact_messages');
