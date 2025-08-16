-- Add more general categories for writing about "allt möjligt"
-- Run this in Supabase SQL Editor

INSERT INTO categories (name, slug, description) VALUES 
    ('Affärshemligheter', 'affarshemligheter', 'Tips och tricks som vi lärt oss på resan'),
    ('Smått och gott', 'smatt-och-gott', 'Random grejer vi tänker på och vill dela'),
    ('Might delete later', 'might-delete-later', 'Halvfärdiga tankar och experimentella inlägg'),
    ('Rants', 'rants', 'När vi behöver ventilera om saker som irriterar oss'),
    ('Livet som ung företagare', 'livet-som-ung-foretagare', 'Berättelser från vår företagarresa'),
    ('Tips från träden', 'tips-fran-traden', 'Praktiska tips för utvecklare och företagare')
ON CONFLICT (slug) DO NOTHING;

-- Also add some new fun tags
INSERT INTO tags (name, slug) VALUES 
    ('Affärshemligheter', 'affarshemligheter'),
    ('Smått och gott', 'smatt-och-gott'),
    ('Might delete later', 'might-delete-later'),
    ('Rant', 'rant-tag'),
    ('Life hack', 'life-hack'),
    ('Behind the scenes', 'behind-the-scenes'),
    ('Amatörtips', 'amatortips'),
    ('Såhär tänker vi', 'sahar-tanker-vi'),
    ('Vardagsfilosofi', 'vardagsfilosofi'),
    ('Rookie mistakes', 'rookie-mistakes')
ON CONFLICT (slug) DO NOTHING;