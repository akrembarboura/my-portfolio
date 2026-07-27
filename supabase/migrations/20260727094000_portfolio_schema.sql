-- 1. Projects Table (Merged Portfolio + Admin Template Fields)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    num TEXT,
    icon TEXT,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    github TEXT,
    demo TEXT,
    before_image TEXT,
    after_image TEXT,
    category TEXT,
    completion_date TEXT,
    location TEXT,
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Timeline Entries Table (Academic, Hackathons, Experience)
CREATE TABLE IF NOT EXISTS timeline_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,          -- e.g., '💼 Experience', '📚 Training'
    type_badge TEXT,             -- e.g., 'Work', 'Self-Taught'
    role TEXT NOT NULL,
    date_range TEXT NOT NULL,    -- e.g., '2023 — Present'
    org TEXT NOT NULL,           -- e.g., 'ISIMA', 'Université de Toulouse'
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skill Categories Table
CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT,
    icon_class TEXT,             -- e.g., 'fe', 'be', 'db' for UI styling
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level INT NOT NULL DEFAULT 0,
    icon TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Leads Table (Contact Form)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    project_type TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    image TEXT,
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Portfolio Images
CREATE TABLE IF NOT EXISTS portfolio_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT,
    url TEXT,
    category TEXT,
    sort_order INT DEFAULT 0,
    size INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT,
    photo TEXT,
    rating INT DEFAULT 5,
    review TEXT,
    company TEXT,
    published BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'published',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Hero Content (Singleton)
CREATE TABLE IF NOT EXISTS hero_content (
    id INT PRIMARY KEY DEFAULT 1,
    headline TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cta_text TEXT,
    cta_link TEXT,
    background_image TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. About Content (Singleton)
CREATE TABLE IF NOT EXISTS about_content (
    id INT PRIMARY KEY DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    experience TEXT,
    image TEXT,
    skills JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SEO Settings (Singleton)
CREATE TABLE IF NOT EXISTS seo_settings (
    id INT PRIMARY KEY DEFAULT 1,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    og_image TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Site Settings (Singleton)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    business_name TEXT,
    owner_name TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    siret TEXT,
    ape_code TEXT,
    maps_embed TEXT,
    opening_hours JSONB,
    social_facebook TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Media Items
CREATE TABLE IF NOT EXISTS media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    folder TEXT NOT NULL,
    size INT NOT NULL,
    mime_type TEXT,
    type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INITIALIZE SINGLETONS
INSERT INTO hero_content (id, headline, subtitle, cta_text, cta_link) 
VALUES (1, 'Welcome to My Portfolio', 'I build modern web apps.', 'Contact Me', '#contact')
ON CONFLICT DO NOTHING;

INSERT INTO about_content (id, title, description) 
VALUES (1, 'About Me', 'Passionate developer.')
ON CONFLICT DO NOTHING;

INSERT INTO seo_settings (id, meta_title) 
VALUES (1, 'My Portfolio')
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (id, business_name) 
VALUES (1, 'My Business')
ON CONFLICT DO NOTHING;

-- ENABLE RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC POLICIES (Read-Only + Insert for Leads)
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON timeline_entries FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON media_items FOR SELECT USING (true);

-- CONTACT FORM
CREATE POLICY "Public Insert" ON leads FOR INSERT WITH CHECK (true);

-- ADMIN POLICIES (Full CRUD)
CREATE POLICY "Admin Full Access" ON projects USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON timeline_entries USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON skill_categories USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON skills USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON leads USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON services USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON portfolio_images USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON testimonials USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON hero_content USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON about_content USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON seo_settings USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON site_settings USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON media_items USING (auth.role() = 'authenticated');

-- AUTO-UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_projects_upd BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_timeline_upd BEFORE UPDATE ON timeline_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_leads_upd BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_services_upd BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_portfolio_images_upd BEFORE UPDATE ON portfolio_images FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_hero_content_upd BEFORE UPDATE ON hero_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_about_content_upd BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_seo_settings_upd BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_site_settings_upd BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_media_items_upd BEFORE UPDATE ON media_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
