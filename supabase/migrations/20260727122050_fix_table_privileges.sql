-- Grant privileges to anon and authenticated roles for all created tables
-- since RLS handles access control, we need to grant basic table privileges first

GRANT ALL ON TABLE public.contact_messages TO anon;
GRANT ALL ON TABLE public.contact_messages TO authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;

GRANT ALL ON TABLE public.projects TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.timeline_entries TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.skill_categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.skills TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.leads TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.services TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.portfolio_images TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.testimonials TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.hero_content TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.about_content TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.seo_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.media_items TO anon, authenticated, service_role;

-- Also ensure usage on sequences if any
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
