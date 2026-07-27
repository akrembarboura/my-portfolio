-- Create the contact_messages table based on Admin constraints
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  "projectType" text,
  status text DEFAULT 'new'::text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow completely anonymous users to insert messages from your public website form
CREATE POLICY "Allow anonymous inserts" ON public.contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);
  
-- Allow authenticated users (Admin Panel) to view all messages
CREATE POLICY "Allow authenticated users to read" ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (Admin Panel) to update statuses
CREATE POLICY "Allow authenticated users to update" ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
  
-- Allow authenticated users (Admin Panel) to delete messages completely
CREATE POLICY "Allow authenticated users to delete" ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);
