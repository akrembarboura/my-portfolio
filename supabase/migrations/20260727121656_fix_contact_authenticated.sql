-- Fix: Allow authenticated users to also insert contact messages
-- Without this, if an admin tests the contact form while logged in, it will fail RLS.
CREATE POLICY "Allow authenticated users to insert" ON public.contact_messages
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);
