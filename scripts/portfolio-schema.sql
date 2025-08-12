-- Portfolio Schema - Lägg till endast portfolio-tabeller
-- Kör denna i Supabase SQL Editor

-- Lägg till color kolumn till tags om den saknas
ALTER TABLE tags ADD COLUMN IF NOT EXISTS color TEXT;

-- Portfolio Categories
CREATE TABLE IF NOT EXISTS portfolio_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Services Junction
CREATE TABLE IF NOT EXISTS portfolio_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES portfolio_categories(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, service_id)
);

-- Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    project_type TEXT DEFAULT 'simple', -- 'simple' or 'case_study'
    excerpt TEXT,
    description TEXT,
    case_study_content TEXT,
    client_name TEXT,
    project_url TEXT,
    completion_date DATE,
    featured_image TEXT,
    technologies_used TEXT,
    published BOOLEAN DEFAULT false,
    author_id UUID NOT NULL REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Gallery
CREATE TABLE IF NOT EXISTS portfolio_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Item Categories (Many-to-many)
CREATE TABLE IF NOT EXISTS portfolio_item_categories (
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    portfolio_category_id UUID REFERENCES portfolio_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (portfolio_item_id, portfolio_category_id)
);

-- Portfolio Item Tags (Many-to-many)
CREATE TABLE IF NOT EXISTS portfolio_item_tags (
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (portfolio_item_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON portfolio_categories(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_slug ON portfolio_items(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_published ON portfolio_items(published);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_project_type ON portfolio_items(project_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_author ON portfolio_items(author_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_gallery_item ON portfolio_gallery(portfolio_item_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_gallery_sort ON portfolio_gallery(portfolio_item_id, sort_order);

-- Create updated_at trigger for portfolio_items
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_item_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Portfolio Categories - publicly viewable, admin manageable
CREATE POLICY "Portfolio categories are publicly viewable" ON portfolio_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio categories" ON portfolio_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Portfolio Services - publicly viewable, admin manageable
CREATE POLICY "Portfolio services are publicly viewable" ON portfolio_services
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio services" ON portfolio_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Portfolio Items - published ones publicly viewable, admin manageable
CREATE POLICY "Published portfolio items are publicly viewable" ON portfolio_items
    FOR SELECT USING (published = true);

CREATE POLICY "Admin users can view all portfolio items" ON portfolio_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admin users can manage portfolio items" ON portfolio_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Portfolio Gallery - viewable for published portfolio items, admin manageable
CREATE POLICY "Portfolio gallery is viewable for published items" ON portfolio_gallery
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portfolio_items 
            WHERE id = portfolio_item_id AND published = true
        )
    );

CREATE POLICY "Admin users can view all portfolio gallery" ON portfolio_gallery
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admin users can manage portfolio gallery" ON portfolio_gallery
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Portfolio Item Categories - publicly viewable, admin manageable
CREATE POLICY "Portfolio item categories are publicly viewable" ON portfolio_item_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio item categories" ON portfolio_item_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Portfolio Item Tags - publicly viewable, admin manageable  
CREATE POLICY "Portfolio item tags are publicly viewable" ON portfolio_item_tags
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage portfolio item tags" ON portfolio_item_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Insert some default portfolio categories
INSERT INTO portfolio_categories (name, slug, description) VALUES
    ('Webbutveckling', 'webbutveckling', 'Moderna webbapplikationer och hemsidor'),
    ('Mobilappar', 'mobilappar', 'iOS och Android applikationer'),
    ('Design', 'design', 'UI/UX design och grafisk design'),
    ('E-handel', 'e-handel', 'E-handelsplattformar och online-butiker'),
    ('Konsulting', 'konsulting', 'Teknisk rådgivning och strategisk planering'),
    ('Automation', 'automation', 'Processautomation och verktyg')
ON CONFLICT (slug) DO NOTHING;