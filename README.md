# Bearbetar - Webbutveckling & Design

En modern webbplats för Bearbetar, ett företag som hjälper småföretag och privatpersoner med webbutveckling, appar och design.

## 🚀 Funktioner

- **Modern webbplats** byggd med Next.js 14 och React
- **Responsiv design** som fungerar på alla enheter
- **Blog-system** för artiklar och innehåll
- **Portfolio** för att visa projekt
- **Kontaktformulär** för kundförfrågningar
- **Admin-panel** för innehållshantering
- **Mörkt/ljust tema** med automatisk detektering
- **SEO-optimerad** för bättre synlighet

## 🛠️ Teknisk stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui komponenter
- **Backend**: Supabase (databas, autentisering, filhantering)
- **Formulär**: React Hook Form med Zod validering
- **Ikoner**: Lucide React
- **Deployment**: Vercel (rekommenderat)

## 📦 Installation

1. **Klona projektet**
   ```bash
   git clone https://github.com/ditt-anvandarnamn/bearbetar.git
   cd bearbetar
   ```

2. **Installera beroenden**
   ```bash
   npm install
   ```

3. **Konfigurera miljövariabler**
   Skapa en `.env.local` fil i projektets rot:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=din-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=din-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=din-service-role-key
   ```

4. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```

5. **Öppna i webbläsaren**
   Gå till [http://localhost:3000](http://localhost:3000)

## 🗄️ Databas setup

Projektet använder Supabase som backend. Se `supabase-schema.sql` för databasschema.

### Snabb setup med Supabase:

1. Skapa ett konto på [supabase.com](https://supabase.com)
2. Skapa ett nytt projekt
3. Kör SQL-skriptet från `supabase-schema.sql` i Supabase SQL Editor
4. Kopiera projekt-URL och anon key till `.env.local`

## 📁 Projektstruktur

```
bearbetar/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── admin/          # Admin-panel
│   │   ├── api/            # API routes
│   │   ├── blog/           # Blog-sidor
│   │   ├── kontakt/        # Kontaktsida
│   │   ├── om-oss/         # Om oss-sida
│   │   ├── portfolio/      # Portfolio-sidor
│   │   └── tjanster/       # Tjänster-sidor
│   ├── components/         # React komponenter
│   │   ├── admin/          # Admin-komponenter
│   │   ├── blog/           # Blog-komponenter
│   │   ├── forms/          # Formulär-komponenter
│   │   ├── layout/         # Layout-komponenter
│   │   ├── portfolio/      # Portfolio-komponenter
│   │   ├── services/       # Tjänster-komponenter
│   │   └── ui/             # UI-komponenter
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities och konfiguration
│   └── types/              # TypeScript typer
├── public/                 # Statiska filer
├── scripts/                # Setup-script
└── supabase-schema.sql     # Databasschema
```

## 🎨 Anpassning

### Färger och tema
Teman kan anpassas i `tailwind.config.js` och `src/components/providers/theme-provider.tsx`.

### Innehåll
- **Artiklar**: Hanteras via admin-panelen på `/admin/articles`
- **Tjänster**: Hanteras via admin-panelen på `/admin/services`
- **Portfolio**: Hanteras via admin-panelen på `/admin/portfolio`

### Språk
Projektet är byggt för svenska men kan enkelt anpassas för andra språk genom att uppdatera text i komponenterna.

## 🚀 Deployment

### Vercel (rekommenderat)
1. Pusha kod till GitHub
2. Koppla GitHub-repo till Vercel
3. Konfigurera miljövariabler i Vercel
4. Deploy!

### Andra plattformar
Projektet kan deployas på vilken som helst plattform som stöder Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Bidrag

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/amazing-feature`)
3. Committa dina ändringar (`git commit -m 'Add amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request

## 📝 Licens

Detta projekt är licensierat under MIT-licensen - se [LICENSE](LICENSE) filen för detaljer.

## 📞 Support

Har du frågor eller behöver hjälp? Kontakta oss på:
- Email: hej@bearbetar.se
- Hemsida: [bearbetar.se](https://bearbetar.se)

---

Byggt med ❤️ för svensk webbutveckling
