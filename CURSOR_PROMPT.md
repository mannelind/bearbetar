# Bygg Bearbetar Webbapp MVP

Du ska hjälpa mig bygga en komplett Next.js webbapplikation för företaget Bearbetar. Detta är en MVP med fokus på admin-panel, artikel/blogg-system och tjänstehantering.

## 🎯 Projektmål

Skapa en modern, skalbar webbapplikation som:
- Har rollbaserad admin-inloggning (2 admins)
- Hanterar artiklar/blogg med kategorier och taggar
- Visar företagets tjänster publikt
- Är helt responsiv och mobilanpassad
- Har stark säkerhet med Supabase RLS
- Är redo för framtida utbyggnad (AI-bot, gamification, etc.)

## 🛠️ Teknisk Stack

- **Framework**: Next.js 14 med App Router
- **Language**: TypeScript (strikt typning)
- **Styling**: Tailwind CSS med custom design system
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Projektstruktur

```
bearbetar-webapp/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Hem/landing page
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   │
│   │   ├── admin/                    # Admin panel (skyddat)
│   │   │   ├── layout.tsx           # Admin layout + auth check
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Magic link login
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx         # Lista artiklar
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx     # Skapa artikel
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # Visa artikel
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Redigera artikel
│   │   │   └── services/
│   │   │       ├── page.tsx         # Lista tjänster
│   │   │       ├── new/
│   │   │       │   └── page.tsx     # Skapa tjänst
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx # Redigera tjänst
│   │   │
│   │   ├── blog/                     # Publika artiklar
│   │   │   ├── page.tsx             # Artikellista med filtrering
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Enskild artikel
│   │   │
│   │   ├── tjanster/                 # Publika tjänster
│   │   │   ├── page.tsx             # Tjänstelista
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Enskild tjänst
│   │   │
│   │   └── api/                      # API routes
│   │       └── auth/
│   │           └── callback/
│   │               └── route.ts     # Supabase auth callback
│   │
│   ├── components/
│   │   ├── ui/                      # Basic UI komponenter
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── loading.tsx
│   │   ├── forms/
│   │   │   ├── article-form.tsx
│   │   │   └── service-form.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── admin-navigation.tsx
│   │   └── auth/
│   │       └── protected-route.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts             # Supabase config (server + client)
│   │   ├── auth.ts                 # Auth utilities
│   │   ├── utils.ts                # General utilities
│   │   ├── validations.ts          # Zod schemas
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-supabase.ts
│   │
│   └── types/
│       └── index.ts                # App-specific types
│
├── public/
│   └── images/
├── .env.local
├── .env.example
├── middleware.ts                    # Route protection
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Design System

### Färger (Tailwind)
- **Primary**: Blue (600-700) - Företagsfärg
- **Secondary**: Gray (500-700) - Text och borders  
- **Success**: Green (500-600) - Framgång
- **Warning**: Yellow (500-600) - Varningar
- **Error**: Red (500-600) - Fel

### Komponenter
- Moderna rounded corners (rounded-lg, rounded-xl)
- Subtila shadows för depth
- Hover-effekter med transitions
- Konsistent spacing (4, 6, 8, 12, 16, 24)
- Responsiv design (sm:, md:, lg:, xl:)

## 🔐 Säkerhet & Auth

### Supabase Auth Setup
- Magic link-inloggning (inget lösenord)
- Endast 2 godkända admin-emails kan logga in
- Session-hantering med cookies
- Automatisk redirect efter inloggning

### Database Security
- Row Level Security (RLS) på alla tabeller
- Publika läsrättigheter för published content
- Admin-only skrivrättigheter
- Automatisk updated_at triggers

### Miljövariabler
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS="admin1@bearbetar.se,admin2@bearbetar.se"
NEXT_PUBLIC_SITE_URL=
```

## 💾 Databas Schema

Skapa dessa tabeller i Supabase:

### admin_users
- id (uuid, primary key, references auth.users)
- email (text, unique)
- full_name (text, optional)
- created_at, updated_at (timestamp)

### articles
- id (uuid, primary key)
- title (text, required)
- slug (text, unique, generated from title)
- content (text, required)
- excerpt (text, optional, max 300 chars)
- featured_image (text, optional URL)
- published (boolean, default false)
- published_at (timestamp, optional)
- created_at, updated_at (timestamp)
- author_id (uuid, references admin_users)

### categories
- id (uuid, primary key)
- name (text, unique)
- slug (text, unique)
- description (text, optional)
- created_at (timestamp)

### tags
- id (uuid, primary key)  
- name (text, unique)
- slug (text, unique)
- created_at (timestamp)

### services
- id (uuid, primary key)
- title (text, required)
- slug (text, unique)
- description (text, required)
- short_description (text, optional, max 200 chars)
- icon (text, optional, Lucide icon name)
- featured_image (text, optional URL)
- price_info (text, optional, ex: "Från 5000 kr")
- active (boolean, default true)
- sort_order (integer, default 0)
- created_at, updated_at (timestamp)

### Relations (many-to-many)
- article_categories (article_id, category_id)
- article_tags (article_id, tag_id)

## ✅ Funktionskrav

### 1. Startsida (/)
- Hero section med företagspresentation
- Funktioner/tjänster preview
- Call-to-action knappar
- Modern, professionell design

### 2. Admin Login (/admin/login)
- E-post input för magic link
- Felhantering och loading states
- Automatisk redirect efter inloggning
- Endast för godkända admin-emails

### 3. Admin Dashboard (/admin)
- Översikt med statistik (antal artiklar, tjänster, etc.)
- Snabbåtgärder (skapa artikel, lägg till tjänst)
- Senaste aktivitet
- Navigation till alla admin-funktioner

### 4. Artikel-hantering (/admin/articles)
- Lista alla artiklar med filter och sök
- Skapa nya artiklar med rich text editor (eller textarea)
- Redigera befintliga artiklar
- Publicera/avpublicera
- Kategori- och tagg-hantering
- SEO-vänliga slugs (genereras automatiskt)

### 5. Tjänst-hantering (/admin/services)
- Lista alla tjänster
- Skapa/redigera tjänster
- Aktivera/inaktivera
- Sorteringsordning
- Ikon-val från Lucide

### 6. Publik blogg (/blog)
- Lista publicerade artiklar
- Filtrering på kategorier och taggar
- Sökfunktion
- Paginering
- SEO-optimerade URL:er

### 7. Publika tjänster (/tjanster)
- Visa aktiva tjänster
- Vacker presentation med ikoner
- Kontaktmöjligheter
- Responsiv design

## 🎯 Tekniska Krav

### Performance
- Server-side rendering för SEO
- Bildoptimering
- Lazy loading
- Minimal bundle size

### SEO
- Meta tags för alla sidor
- Open Graph tags
- Structured data för artiklar
- XML sitemap (framtida)

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast support

### Mobile-first
- Responsiv design från början
- Touch-friendly UI
- PWA-ready (framtida utbyggnad)

## 🔧 Utvecklingsinstruktioner

### 1. Setup
- Använd TypeScript strikt mode
- Konfigurera ESLint + Prettier
- Sätt upp absoluta imports (@/)

### 2. Konventioner
- Komponenter i PascalCase
- Filer i kebab-case
- Funktioner i camelCase
- Konsekventa interface-namn

### 3. Error Handling
- Try-catch för alla API-anrop
- Användarvänliga felmeddelanden
- Loading states för async operations
- Form validation med Zod

### 4. State Management
- Server state med Supabase
- Client state med React useState
- Form state med React Hook Form
- No external state library needed

## 📝 Content Examples

### Artikel-exempel
```
Titel: "5 sätt att öka lönsamheten i ditt företag"
Innehåll: Professionell text om affärsutveckling
Kategorier: Strategi, Lönsamhet
Taggar: tips, ekonomi, tillväxt
```

### Tjänst-exempel
```
Titel: "Strategisk Affärsutveckling"
Beskrivning: "Vi hjälper er utveckla hållbara strategier..."
Ikon: TrendingUp (från Lucide)
Prisinformation: "Från 15 000 kr"
```

## 🚀 Deployment

- Vercel för hosting
- Supabase för backend
- Miljövariabler konfigurerade
- Custom domain setup

---

## 📋 Uppgift för Claude

Skapa denna kompletta applikation steg för steg:

1. **Börja med projektsetup** - package.json, configs, struktur
2. **Bygg auth-systemet** - login, middleware, säkerhet  
3. **Skapa UI-komponenter** - button, input, layout
4. **Implementera admin-panel** - dashboard, navigation
5. **Bygg artikel-system** - CRUD, formulär, listning
6. **Lägg till tjänst-hantering** - CRUD, admin interface
7. **Skapa publika sidor** - blog, tjänster, startsida
8. **Finslipa och testa** - responsivitet, SEO, prestanda

Fokusera på kvalitetskod, säkerhet och användarvänlighet. Fråga om något är oklart!