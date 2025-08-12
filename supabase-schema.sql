-- Supabase Schema för Bearbetar webapp
-- Detta skript skapar alla tabeller och relationer som behövs

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create tables
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    icon TEXT,
    featured_image TEXT,
    price_info TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS article_categories (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, category_id)
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Portfolio/Case tables
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT, -- For longer case descriptions
    excerpt TEXT, -- Short description for cards
    featured_image TEXT,
    project_type TEXT DEFAULT 'simple', -- 'simple' or 'case_study'
    client_name TEXT,
    project_url TEXT,
    completion_date DATE,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Gallery for portfolio items (multiple images for case studies)
CREATE TABLE IF NOT EXISTS portfolio_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_alt TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio categories (can be different from article categories)
CREATE TABLE IF NOT EXISTS portfolio_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio item to category relationship
CREATE TABLE IF NOT EXISTS portfolio_item_categories (
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    category_id UUID REFERENCES portfolio_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (portfolio_item_id, category_id)
);

-- Portfolio item to tag relationship (reuse existing tags)
CREATE TABLE IF NOT EXISTS portfolio_item_tags (
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (portfolio_item_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio_items(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_items(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_type ON portfolio_items(project_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON portfolio_categories(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_gallery_order ON portfolio_gallery(portfolio_item_id, sort_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_item_tags ENABLE ROW LEVEL SECURITY;

-- Admin users policies - only authenticated users can access
CREATE POLICY "Admin users can view their own data" ON admin_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can view all other admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admin users can update their own data" ON admin_users
    FOR UPDATE USING (auth.uid() = id);

-- Company settings policies - admin read/write, public read for some
CREATE POLICY "Company settings are publicly viewable" ON company_settings
    FOR SELECT USING (key IN ('about_us_description', 'company_name'));

CREATE POLICY "Admin users can view all company settings" ON company_settings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admin users can manage company settings" ON company_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Articles policies - public read, admin write
CREATE POLICY "Published articles are publicly viewable" ON articles
    FOR SELECT USING (published = true);

CREATE POLICY "Admin users can view all articles" ON articles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admin users can insert articles" ON articles
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
        AND author_id = auth.uid()
    );

CREATE POLICY "Admin users can update their articles" ON articles
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
        AND author_id = auth.uid()
    );

CREATE POLICY "Admin users can delete their articles" ON articles
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
        AND author_id = auth.uid()
    );

-- Services policies - public read, admin write
CREATE POLICY "Active services are publicly viewable" ON services
    FOR SELECT USING (active = true);

CREATE POLICY "Admin users can view all services" ON services
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admin users can manage services" ON services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Categories policies - public read, admin write
CREATE POLICY "Categories are publicly viewable" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage categories" ON categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Tags policies - public read, admin write  
CREATE POLICY "Tags are publicly viewable" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage tags" ON tags
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Junction table policies
CREATE POLICY "Article categories are publicly viewable" ON article_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage article categories" ON article_categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Article tags are publicly viewable" ON article_tags
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage article tags" ON article_tags
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Insert some default categories
INSERT INTO categories (name, slug, description) VALUES 
    ('Utveckling', 'utveckling', 'Tips och tricks för webbutveckling och kodning'),
    ('Företagande', 'foretagande', 'Tankar och erfarenheter från att driva eget företag'),
    ('Teknik', 'teknik', 'Nya verktyg, ramverk och teknologier vi testat'),
    ('Livets gång', 'livets-gang', 'Random tankar om livet som utvecklare och företagare')
ON CONFLICT (slug) DO NOTHING;

-- Insert some default tags
INSERT INTO tags (name, slug) VALUES 
    ('React', 'react'),
    ('Next.js', 'nextjs'),
    ('TypeScript', 'typescript'),
    ('Python', 'python'),
    ('Webbdesign', 'webbdesign'),
    ('UX/UI', 'ux-ui'),
    ('Tips', 'tips'),
    ('Rant', 'rant'),
    ('Företagande', 'foretagande'),
    ('Kund-projekt', 'kund-projekt')
ON CONFLICT (slug) DO NOTHING;

-- Portfolio RLS policies
-- Portfolio items policies - public read for published, admin write
CREATE POLICY "Published portfolio items are publicly viewable" ON portfolio_items
    FOR SELECT USING (published = true);

CREATE POLICY "Admin users can view all portfolio items" ON portfolio_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admin users can insert portfolio items" ON portfolio_items
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
        AND author_id = auth.uid()
    );

CREATE POLICY "Admin users can update their portfolio items" ON portfolio_items
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
        AND author_id = auth.uid()
    );

CREATE POLICY "Admin users can delete their portfolio items" ON portfolio_items
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
        AND author_id = auth.uid()
    );

-- Portfolio gallery policies - public read, admin write
CREATE POLICY "Portfolio gallery is publicly viewable" ON portfolio_gallery
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portfolio_items 
            WHERE id = portfolio_gallery.portfolio_item_id 
            AND published = true
        )
    );

CREATE POLICY "Admin users can view all portfolio gallery" ON portfolio_gallery
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Admin users can manage portfolio gallery" ON portfolio_gallery
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Portfolio categories policies - public read, admin write
CREATE POLICY "Portfolio categories are publicly viewable" ON portfolio_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio categories" ON portfolio_categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Junction table policies for portfolio
CREATE POLICY "Portfolio item categories are publicly viewable" ON portfolio_item_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio item categories" ON portfolio_item_categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

CREATE POLICY "Portfolio item tags are publicly viewable" ON portfolio_item_tags
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio item tags" ON portfolio_item_tags
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Insert default portfolio categories
INSERT INTO portfolio_categories (name, slug, description) VALUES 
    ('Webbsidor', 'webbsidor', 'Responsiva webbplatser och landningssidor'),
    ('Webappar', 'webappar', 'Interaktiva webbapplikationer'),
    ('E-handel', 'e-handel', 'Onlinebutiker och e-handelsplatser'),
    ('System', 'system', 'Skräddarsydda system och dashboards'),
    ('Design', 'design', 'UI/UX design och grafiska projekt')
ON CONFLICT (slug) DO NOTHING;

-- Insert default company settings
INSERT INTO company_settings (key, value, description) VALUES 
    ('about_us_description', 'Vi bygger webbsidor, appar och system för företag som vill ha något som bara funkar. Vi skriver också om våra erfarenheter, tips vi lärt oss och random saker vi funderar på. Vi är två utvecklare som startat eget och vill hjälpa andra att få sina digitala idéer till verklighet.', 'Allmän beskrivning av företaget för Om oss-sidan'),
    ('company_name', 'Bearbetar', 'Företagsnamn'),
    ('contact_email', 'hej@bearbetar.se', 'Huvudkontakt-email'),
    ('founded_year', '2024', 'Året företaget grundades')
ON CONFLICT (key) DO NOTHING;