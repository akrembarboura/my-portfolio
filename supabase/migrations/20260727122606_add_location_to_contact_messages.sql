-- Add location column to contact_messages
ALTER TABLE public.contact_messages
ADD COLUMN location text;
