-- Supabase Schema för Bearbetar webapp
-- Detta skript skapar alla tabeller och relationer som behövs

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create tables
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

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

-- Row Level Security (RLS) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Admin users policies - only authenticated users can access
CREATE POLICY "Admin users can view their own data" ON admin_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update their own data" ON admin_users
    FOR UPDATE USING (auth.uid() = id);

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
    ('Affärsutveckling', 'affarsutveckling', 'Strategier för tillväxt och utveckling'),
    ('Ledarskap', 'ledarskap', 'Leadership och management'),
    ('Analys', 'analys', 'Dataanalys och beslutsfattning'),
    ('Strategi', 'strategi', 'Affärsstrategier och planering')
ON CONFLICT (slug) DO NOTHING;

-- Insert some default tags
INSERT INTO tags (name, slug) VALUES 
    ('Tillväxt', 'tillvaxt'),
    ('Innovation', 'innovation'),
    ('Digital transformation', 'digital-transformation'),
    ('Processer', 'processer'),
    ('Konsulting', 'konsulting'),
    ('Rådgivning', 'radgivning')
ON CONFLICT (slug) DO NOTHING;