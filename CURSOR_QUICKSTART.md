# Cursor Claude Quickstart - Bearbetar Webapp

> Kopiera denna text till Cursor och be Claude att följa instruktionerna steg för steg

## 🎯 Snabbstart för Claude i Cursor

Hej Claude! Jag vill att du hjälper mig att bygga Bearbetar webbappen enligt specifikationerna i `CURSOR_PROMPT.md` och `README.md`. Följ dessa steg i exakt denna ordning:

## Steg 1: Projektsetup 🏗️

1. **Skapa Next.js projekt struktur:**
   - Skapa `package.json` med alla dependencies från `PROJECT_CONFIG.md`
   - Skapa `next.config.js`, `tailwind.config.js`, `tsconfig.json`
   - Skapa `.env.example` fil
   - Skapa grundläggande mappstruktur enligt specifikationen

2. **Konfigurera TypeScript & Tailwind:**
   - Sätt upp korrekt TypeScript konfiguration
   - Konfigurera Tailwind med Bearbetar brand colors
   - Skapa `globals.css` med Tailwind imports

## Steg 2: Supabase Integration 🔐

1. **Skapa Supabase konfiguration:**
   - `src/lib/supabase.ts` - Server och client konfiguration
   - `src/lib/auth.ts` - Auth utilities och helpers
   - `src/lib/utils.ts` - Allmänna utilities (cn, generateSlug, etc.)

2. **Sätt upp middleware:**
   - `middleware.ts` - Route protection för admin-område
   - Auth callback route: `src/app/api/auth/callback/route.ts`

## Steg 3: Type Definitions 📝

1. **Skapa TypeScript typer:**
   - `src/types/index.ts` - Alla app-specifika interface
   - Definiera User, Article, Service, Category, Tag types
   - Form types och API response types

2. **Validering med Zod:**
   - `src/lib/validations.ts` - Alla Zod schemas
   - loginSchema, articleSchema, serviceSchema
   - Export TypeScript types från schemas

## Steg 4: UI Components 🎨

1. **Basic UI komponenter i `src/components/ui/`:**
   - `button.tsx` - Med variants, sizes, loading states
   - `input.tsx` - Med label, error, ikoner
   - `textarea.tsx` - För längre texter
   - `card.tsx` - Container komponent
   - `badge.tsx` - För kategorier/taggar
   - `loading.tsx` - Loading spinners

2. **Layout komponenter i `src/components/layout/`:**
   - `header.tsx` - Publik header med navigation
   - `footer.tsx` - Footer med links
   - `admin-navigation.tsx` - Admin sidebar navigation

## Steg 5: Authentication System 🔑

1. **Admin login sida:**
   - `src/app/admin/login/page.tsx` - Magic link login form
   - Hantera loading states och fel
   - Email sent confirmation

2. **Admin layout med auth check:**
   - `src/app/admin/layout.tsx` - Kontrollera admin-rättigheter
   - Automatisk redirect om ej admin
   - Visa admin navigation

## Steg 6: Admin Dashboard 📊

1. **Dashboard översikt:**
   - `src/app/admin/page.tsx` - Admin dashboard
   - Visa statistik (antal artiklar, tjänster)
   - Snabbåtgärder (skapa artikel/tjänst)
   - Recent activity placeholder

2. **Admin navigation:**
   - Sidebar med alla admin-funktioner
   - User info och logout
   - Mobile responsiv navigation

## Steg 7: Artikel System 📝

1. **Artikel CRUD:**
   - `src/app/admin/articles/page.tsx` - Lista alla artiklar
   - `src/app/admin/articles/new/page.tsx` - Skapa artikel
   - `src/app/admin/articles/[id]/page.tsx` - Visa artikel
   - `src/app/admin/articles/[id]/edit/page.tsx` - Redigera artikel

2. **Artikel formulär:**
   - `src/components/forms/article-form.tsx` - Återanvändbart formulär
   - React Hook Form + Zod validation
   - Rich text editor eller textarea
   - Kategori och tagg-hantering

3. **Publika artikel-sidor:**
   - `src/app/blog/page.tsx` - Lista publicerade artiklar
   - `src/app/blog/[slug]/page.tsx` - Enskild artikel
   - Filtrering på kategorier och taggar
   - SEO metadata

## Steg 8: Tjänst System 🛠️

1. **Tjänst CRUD:**
   - `src/app/admin/services/page.tsx` - Lista tjänster
   - `src/app/admin/services/new/page.tsx` - Skapa tjänst
   - `src/app/admin/services/[id]/edit/page.tsx` - Redigera tjänst

2. **Tjänst formulär:**
   - `src/components/forms/service-form.tsx` - Service formulär
   - Icon picker från Lucide
   - Pris information
   - Sorteringsordning

3. **Publika tjänst-sidor:**
   - `src/app/tjanster/page.tsx` - Lista aktiva tjänster
   - `src/app/tjanster/[slug]/page.tsx` - Enskild tjänst
   - Vacker presentation med ikoner

## Steg 9: Publik Webbplats 🌐

1. **Startsida:**
   - `src/app/page.tsx` - Modern landing page
   - Hero section med företagspresentation
   - Features/tjänster preview
   - Call-to-action knappar
   - Testimonials/statistik

2. **Layout och navigation:**
   - Uppdatera header med korrekt navigation
   - Footer med företagsinformation
   - Kontakt-information

## Steg 10: Finslipning ✨

1. **Error handling:**
   - `src/app/not-found.tsx` - 404 sida
   - `src/app/loading.tsx` - Global loading
   - Error boundaries för komponenter

2. **SEO och metadata:**
   - Dynamic metadata för artiklar och tjänster
   - Open Graph tags
   - JSON-LD structured data

3. **Responsive design:**
   - Testa alla sidor på mobil
   - Tablet breakpoints
   - Desktop optimering

## 🔍 Kvalitetskontroll

Efter varje steg, kontrollera att:
- [ ] TypeScript kompilerar utan fel
- [ ] Alla imports är korrekta
- [ ] Komponenter är responsiva
- [ ] Error states hanteras
- [ ] Loading states visas
- [ ] Säkerhet implementeras korrekt

## 💡 Viktiga Implementationsdetaljer

1. **Säkerhet först:**
   - Använd `requireAdminAuth()` för skyddade sidor
   - RLS policies hanterar databas-säkerhet
   - Validera all input med Zod

2. **Performance:**
   - Server Components som default
   - Client Components endast när nödvändigt
   - Optimerade Supabase queries

3. **User Experience:**
   - Loading states för alla async operations
   - Tydliga felmeddelanden
   - Bekräftelser för destructive actions

4. **Code Quality:**
   - Konsekvent naming (PascalCase komponenter)
   - TypeScript strict mode
   - Kommentarer för komplexa logik

## 🚨 Vanliga Misstag att Undvika

- ❌ Glöm inte `'use client'` för interactive komponenter
- ❌ Använd aldrig `any` typ i TypeScript  
- ❌ Glöm inte error handling i try-catch
- ❌ Missade loading states för formulär
- ❌ Oskyddade admin routes

## 🎯 Definition of Done

Projektet är klart när:
- [ ] Admin kan logga in med magic link
- [ ] Admin kan skapa, redigera, publicera artiklar
- [ ] Admin kan hantera tjänster
- [ ] Publika sidor visar innehåll korrekt
- [ ] Allt är responsivt och mobilanpassat
- [ ] Säkerhet fungerar (RLS + middleware)
- [ ] TypeScript kompilerar utan fel
- [ ] Inga console errors i browser

## 🚀 Kom igång nu!

**Säg till Claude:** 
"Börja med Steg 1 - skapa projektstrukturen och package.json enligt specifikationen. Fråga mig om något är oklart innan du går vidare till nästa steg."

---

**Lycka till med bygget! 🎉**