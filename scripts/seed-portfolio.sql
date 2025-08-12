-- Portfolio testdata script
-- Kör denna script i Supabase SQL Editor

-- Rensa befintlig data (för testmiljö)
DELETE FROM portfolio_gallery;
DELETE FROM portfolio_item_tags;
DELETE FROM portfolio_item_categories;
DELETE FROM portfolio_items;
DELETE FROM portfolio_categories WHERE name IN ('Webbutveckling', 'Mobilappar', 'Design', 'E-handel', 'Konsulting', 'Automation');
DELETE FROM tags WHERE name IN ('React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Figma', 'UI/UX', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'API', 'E-handel', 'SaaS', 'MVP', 'Startup', 'Konsulting', 'Automation', 'AI/ML', 'DevOps');

-- 1. Skapa kategorier
INSERT INTO portfolio_categories (id, name, slug, description) VALUES
  (gen_random_uuid(), 'Webbutveckling', 'webbutveckling', 'Moderna webbapplikationer och hemsidor'),
  (gen_random_uuid(), 'Mobilappar', 'mobilappar', 'iOS och Android applikationer'),
  (gen_random_uuid(), 'Design', 'design', 'UI/UX design och grafisk design'),
  (gen_random_uuid(), 'E-handel', 'e-handel', 'E-handelsplattformar och online-butiker'),
  (gen_random_uuid(), 'Konsulting', 'konsulting', 'Teknisk rådgivning och strategisk planering'),
  (gen_random_uuid(), 'Automation', 'automation', 'Processorautomation och verktyg');

-- 2. Skapa taggar
INSERT INTO tags (id, name, slug, color) VALUES
  (gen_random_uuid(), 'React', 'react', '#61DAFB'),
  (gen_random_uuid(), 'Next.js', 'nextjs', '#000000'),
  (gen_random_uuid(), 'TypeScript', 'typescript', '#3178C6'),
  (gen_random_uuid(), 'JavaScript', 'javascript', '#F7DF1E'),
  (gen_random_uuid(), 'Node.js', 'nodejs', '#339933'),
  (gen_random_uuid(), 'Python', 'python', '#3776AB'),
  (gen_random_uuid(), 'Figma', 'figma', '#F24E1E'),
  (gen_random_uuid(), 'UI/UX', 'ui-ux', '#FF6B6B'),
  (gen_random_uuid(), 'PostgreSQL', 'postgresql', '#336791'),
  (gen_random_uuid(), 'Supabase', 'supabase', '#3ECF8E'),
  (gen_random_uuid(), 'Tailwind CSS', 'tailwind-css', '#06B6D4'),
  (gen_random_uuid(), 'API', 'api', '#FF9500'),
  (gen_random_uuid(), 'E-handel', 'e-handel', '#E44D26'),
  (gen_random_uuid(), 'SaaS', 'saas', '#4A90E2'),
  (gen_random_uuid(), 'MVP', 'mvp', '#8E44AD'),
  (gen_random_uuid(), 'Startup', 'startup', '#E67E22'),
  (gen_random_uuid(), 'Konsulting', 'konsulting', '#2ECC71'),
  (gen_random_uuid(), 'Automation', 'automation', '#34495E'),
  (gen_random_uuid(), 'AI/ML', 'ai-ml', '#9B59B6'),
  (gen_random_uuid(), 'DevOps', 'devops', '#16A085');

-- 3. Skapa portfolio items
-- Först behöver vi hämta admin user ID (använd första admin användaren)
DO $$
DECLARE
  admin_user_id UUID;
  webbutveckling_id UUID;
  design_id UUID;
  ehandel_id UUID;
  konsulting_id UUID;
  automation_id UUID;
  mobilappar_id UUID;
  
  react_tag UUID;
  nextjs_tag UUID;
  typescript_tag UUID;
  figma_tag UUID;
  uiux_tag UUID;
  nodejs_tag UUID;
  postgresql_tag UUID;
  supabase_tag UUID;
  tailwind_tag UUID;
  ehandel_tag UUID;
  saas_tag UUID;
  mvp_tag UUID;
  api_tag UUID;
  python_tag UUID;
  automation_tag UUID;
  aiml_tag UUID;
  startup_tag UUID;
  konsulting_tag UUID;
  
  portfolio1_id UUID;
  portfolio2_id UUID;
  portfolio3_id UUID;
  portfolio4_id UUID;
  portfolio5_id UUID;
  portfolio6_id UUID;
  portfolio7_id UUID;
  portfolio8_id UUID;
BEGIN
  -- Hämta admin user
  SELECT id INTO admin_user_id FROM admin_users LIMIT 1;
  
  -- Hämta kategori IDs
  SELECT id INTO webbutveckling_id FROM portfolio_categories WHERE slug = 'webbutveckling';
  SELECT id INTO design_id FROM portfolio_categories WHERE slug = 'design';
  SELECT id INTO ehandel_id FROM portfolio_categories WHERE slug = 'e-handel';
  SELECT id INTO konsulting_id FROM portfolio_categories WHERE slug = 'konsulting';
  SELECT id INTO automation_id FROM portfolio_categories WHERE slug = 'automation';
  SELECT id INTO mobilappar_id FROM portfolio_categories WHERE slug = 'mobilappar';
  
  -- Hämta tag IDs
  SELECT id INTO react_tag FROM tags WHERE slug = 'react';
  SELECT id INTO nextjs_tag FROM tags WHERE slug = 'nextjs';
  SELECT id INTO typescript_tag FROM tags WHERE slug = 'typescript';
  SELECT id INTO figma_tag FROM tags WHERE slug = 'figma';
  SELECT id INTO uiux_tag FROM tags WHERE slug = 'ui-ux';
  SELECT id INTO nodejs_tag FROM tags WHERE slug = 'nodejs';
  SELECT id INTO postgresql_tag FROM tags WHERE slug = 'postgresql';
  SELECT id INTO supabase_tag FROM tags WHERE slug = 'supabase';
  SELECT id INTO tailwind_tag FROM tags WHERE slug = 'tailwind-css';
  SELECT id INTO ehandel_tag FROM tags WHERE slug = 'e-handel';
  SELECT id INTO saas_tag FROM tags WHERE slug = 'saas';
  SELECT id INTO mvp_tag FROM tags WHERE slug = 'mvp';
  SELECT id INTO api_tag FROM tags WHERE slug = 'api';
  SELECT id INTO python_tag FROM tags WHERE slug = 'python';
  SELECT id INTO automation_tag FROM tags WHERE slug = 'automation';
  SELECT id INTO aiml_tag FROM tags WHERE slug = 'ai-ml';
  SELECT id INTO startup_tag FROM tags WHERE slug = 'startup';
  SELECT id INTO konsulting_tag FROM tags WHERE slug = 'konsulting';

  -- Portfolio Item 1: E-handelsplattform
  portfolio1_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, case_study_content, client_name, project_url, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio1_id, 'Modern E-handelsplattform för Mode', 'ehandelsplattform-mode', 'case_study', 
   'En fullständig e-handelsupplevelse med modern design och smidig användarupplevelse för modeföretag.',
   '<p>Vi utvecklade en komplett e-handelsplattform för ett växande modeföretag som behövde en modern, skalbar lösning för sin online-försäljning.</p>',
   '<h3>Utmaning</h3><p>Kunden hade en gammal WooCommerce-sajt som var långsam och svår att underhålla. De behövde en modern lösning som kunde hantera stora produktkataloger och hög trafik.</p><h3>Lösning</h3><p>Vi byggde en headless e-handelsplattform med Next.js frontend och Supabase backend. Plattformen inkluderar avancerad produktfiltrering, kundvagn, orderhantering och admin-panel.</p><h3>Resultat</h3><p>40% förbättring av laddningstider, 60% ökning av konverteringsgrad och betydligt enklare produkthantering för kunden.</p>',
   'StyleHub Fashion', 'https://stylehub-demo.bearbetar.se', '2024-03-15', 
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', 
   true, admin_user_id, 'Next.js, React, TypeScript, Supabase, Tailwind CSS, Stripe');

  -- Portfolio Item 2: SaaS Dashboard
  portfolio2_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, client_name, project_url, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio2_id, 'Analytisk Dashboard för SaaS-företag', 'saas-dashboard-analytics', 'case_study',
   'Ett kraftfullt dashboard för att visualisera användardata och affärsmetriker i realtid.',
   '<p>Vi skapade en omfattande analytics-lösning för ett SaaS-företag som behövde bättre insikt i sina användardata och affärsmetriker.</p>',
   'TechMetrics AB', NULL, '2024-02-28',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
   true, admin_user_id, 'React, TypeScript, D3.js, Node.js, PostgreSQL');

  -- Portfolio Item 3: Mobil App Design
  portfolio3_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, client_name, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio3_id, 'Fitness Tracking App Design', 'fitness-app-design', 'simple',
   'Modern UI/UX design för en fitness-app med fokus på användarupplevelse och motivation.',
   '<p>Designade en intuitiv och motiverande användarupplevelse för en fitness-app som hjälper användare att nå sina hälsomål.</p>',
   'FitLife Studios', '2024-01-20',
   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
   true, admin_user_id, 'Figma, Adobe XD, Prototyping');

  -- Portfolio Item 4: Automatiseringslösning
  portfolio4_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, case_study_content, client_name, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio4_id, 'AI-driven Processautomation', 'ai-processautomation', 'case_study',
   'Automatiserade manuella processer med AI och maskininlärning för att öka effektiviteten.',
   '<p>Utvecklade en AI-driven lösning som automatiserar repetitiva arbetsuppgifter och förbättrar arbetsflödet för ett konsultföretag.</p>',
   '<h3>Problemet</h3><p>Kunden spenderade 15+ timmar i veckan på manuell databearbetning och rapportgenerering.</p><h3>Lösningen</h3><p>Vi byggde ett AI-system som automatiskt bearbetar inkommande data, genererar rapporter och skickar ut dem till rätt mottagare.</p><h3>Resultat</h3><p>90% minskning av manuellt arbete och 300% snabbare rapportgenerering.</p>',
   'Consulting Pro AB', '2024-04-10',
   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
   true, admin_user_id, 'Python, TensorFlow, FastAPI, Docker, PostgreSQL');

  -- Portfolio Item 5: Startup MVP
  portfolio5_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, client_name, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio5_id, 'MVP för EdTech Startup', 'edtech-startup-mvp', 'case_study',
   'Snabb utveckling av MVP för att validera affärsidé inom utbildningsteknologi.',
   '<p>Hjälpte en startup att snabbt lansera sin första version för att testa marknaden och samla användarfeedback.</p>',
   'EduNext Startup', '2024-03-30',
   'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
   true, admin_user_id, 'React, Next.js, Supabase, Tailwind CSS');

  -- Portfolio Item 6: Företagshemsida
  portfolio6_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, client_name, project_url, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio6_id, 'Professionell Företagshemsida', 'foretagshemsida-advokatbyra', 'simple',
   'Modern och professionell hemsida för advokatbyrå med fokus på trovärdighet och användarvänlighet.',
   '<p>Skapade en elegant och professionell webb-närvaro för en etablerad advokatbyrå med fokus på att bygga förtroende hos potentiella kunder.</p>',
   'Lindqvist Advokatbyrå', 'https://lindqvist-advokatbyra.se',
   '2024-02-15',
   'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
   true, admin_user_id, 'Next.js, React, Tailwind CSS, CMS');

  -- Portfolio Item 7: API Integration
  portfolio7_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, client_name, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio7_id, 'API-integration för Logistikföretag', 'api-integration-logistik', 'simple',
   'Integrerade flera externa APIs för att automatisera spårning och hantering av leveranser.',
   '<p>Byggde robusta API-integrationer som kopplar samman kundens system med leverantörer och transportföretag.</p>',
   'SwiftLogistics', '2024-01-30',
   'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
   true, admin_user_id, 'Node.js, Express, REST API, WebHooks');

  -- Portfolio Item 8: DevOps Consulting
  portfolio8_id := gen_random_uuid();
  INSERT INTO portfolio_items (id, title, slug, project_type, excerpt, description, case_study_content, client_name, completion_date, featured_image, published, author_id, technologies_used) VALUES
  (portfolio8_id, 'DevOps Transformation', 'devops-transformation', 'case_study',
   'Hjälpte ett mediumstort företag att implementera modern DevOps-praxis för snabbare releases.',
   '<p>Genomförde en komplett transformation av utvecklings- och deployment-processerna för att förbättra kvalitet och hastighet.</p>',
   '<h3>Utgångspunkt</h3><p>Manuella deployments, långa release-cykler och instabila miljöer.</p><h3>Åtgärder</h3><p>Implementerade CI/CD pipelines, containerisering, automatisk testing och monitoring.</p><h3>Resultat</h3><p>80% snabbare releases, 95% färre produktionsfel och mycket gladare utvecklarteam.</p>',
   'TechCorp Solutions', '2024-04-05',
   'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop',
   true, admin_user_id, 'Docker, Kubernetes, Jenkins, AWS, Terraform');

  -- Koppla kategorier till portfolio items
  INSERT INTO portfolio_item_categories (portfolio_item_id, portfolio_category_id) VALUES
    (portfolio1_id, ehandel_id),
    (portfolio1_id, webbutveckling_id),
    (portfolio2_id, webbutveckling_id),
    (portfolio3_id, design_id),
    (portfolio3_id, mobilappar_id),
    (portfolio4_id, automation_id),
    (portfolio4_id, konsulting_id),
    (portfolio5_id, webbutveckling_id),
    (portfolio6_id, webbutveckling_id),
    (portfolio7_id, webbutveckling_id),
    (portfolio8_id, konsulting_id);

  -- Koppla taggar till portfolio items
  -- Portfolio 1: E-handel (React, Next.js, TypeScript, Supabase, Tailwind, E-handel)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio1_id, react_tag),
    (portfolio1_id, nextjs_tag),
    (portfolio1_id, typescript_tag),
    (portfolio1_id, supabase_tag),
    (portfolio1_id, tailwind_tag),
    (portfolio1_id, ehandel_tag);

  -- Portfolio 2: SaaS Dashboard (React, TypeScript, Node.js, PostgreSQL, SaaS)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio2_id, react_tag),
    (portfolio2_id, typescript_tag),
    (portfolio2_id, nodejs_tag),
    (portfolio2_id, postgresql_tag),
    (portfolio2_id, saas_tag);

  -- Portfolio 3: App Design (Figma, UI/UX)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio3_id, figma_tag),
    (portfolio3_id, uiux_tag);

  -- Portfolio 4: AI Automation (Python, AI/ML, Automation, API)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio4_id, python_tag),
    (portfolio4_id, aiml_tag),
    (portfolio4_id, automation_tag),
    (portfolio4_id, api_tag);

  -- Portfolio 5: Startup MVP (React, Next.js, Supabase, MVP, Startup)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio5_id, react_tag),
    (portfolio5_id, nextjs_tag),
    (portfolio5_id, supabase_tag),
    (portfolio5_id, mvp_tag),
    (portfolio5_id, startup_tag);

  -- Portfolio 6: Företagshemsida (Next.js, React, Tailwind)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio6_id, nextjs_tag),
    (portfolio6_id, react_tag),
    (portfolio6_id, tailwind_tag);

  -- Portfolio 7: API Integration (Node.js, API)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio7_id, nodejs_tag),
    (portfolio7_id, api_tag);

  -- Portfolio 8: DevOps (DevOps, Konsulting, Automation)
  INSERT INTO portfolio_item_tags (portfolio_item_id, tag_id) VALUES
    (portfolio8_id, konsulting_tag),
    (portfolio8_id, automation_tag);

END $$;

-- Lägg till några galleribilder för case studies
DO $$
DECLARE
  portfolio1_id UUID;
  portfolio2_id UUID;
  portfolio4_id UUID;
  portfolio5_id UUID;
  portfolio8_id UUID;
BEGIN
  -- Hämta portfolio IDs
  SELECT id INTO portfolio1_id FROM portfolio_items WHERE slug = 'ehandelsplattform-mode';
  SELECT id INTO portfolio2_id FROM portfolio_items WHERE slug = 'saas-dashboard-analytics';
  SELECT id INTO portfolio4_id FROM portfolio_items WHERE slug = 'ai-processautomation';
  SELECT id INTO portfolio5_id FROM portfolio_items WHERE slug = 'edtech-startup-mvp';
  SELECT id INTO portfolio8_id FROM portfolio_items WHERE slug = 'devops-transformation';

  -- Galleribilder för E-handelsplattform
  INSERT INTO portfolio_gallery (portfolio_item_id, image_url, caption, sort_order) VALUES
    (portfolio1_id, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', 'Produktkatalog med avancerad filtrering', 1),
    (portfolio1_id, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', 'Responsiv design på mobil och desktop', 2),
    (portfolio1_id, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', 'Smidig checkout-process', 3);

  -- Galleribilder för SaaS Dashboard
  INSERT INTO portfolio_gallery (portfolio_item_id, image_url, caption, sort_order) VALUES
    (portfolio2_id, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', 'Huvuddashboard med realtidsdata', 1),
    (portfolio2_id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 'Detaljerade analytics och rapporter', 2);

  -- Galleribilder för AI Automation
  INSERT INTO portfolio_gallery (portfolio_item_id, image_url, caption, sort_order) VALUES
    (portfolio4_id, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop', 'AI-driven processöversikt', 1),
    (portfolio4_id, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop', 'Automatiserad rapportgenerering', 2);

END $$;