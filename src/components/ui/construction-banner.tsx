'use client'

export function ConstructionBanner() {
  return (
    <div 
      className="relative w-full h-8 overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--construction-banner) / 0.9)'
      }}
    >
      <div className="flex h-full items-center">
        <div 
          className="whitespace-nowrap text-sm font-medium flex"
          style={{
            animation: 'marquee 40s linear infinite',
            color: 'hsl(var(--construction-banner-foreground))'
          }}
        >
          <span className="mr-8 px-4">🚧 Ursäkta röran! Denna sida är under utveckling och vissa funktioner kanske inte fungerar som förväntat. Vi arbetar hårt för att förbättra din upplevelse. Tack för ditt tålamod! 🛠️</span>
          <span className="mr-8 px-4">⚠️ VIKTIGT: Under utveckling kan information vara felaktig eller ofullständig. Vi förbehåller oss rätten att justera priser, villkor och information efterhand. Inga bindande avtal ingås baserat på information under utvecklingsfasen. ⚠️</span>
          <span className="mr-8 px-4">🚧 Ursäkta röran! Denna sida är under utveckling och vissa funktioner kanske inte fungerar som förväntat. Vi arbetar hårt för att förbättra din upplevelse. Tack för ditt tålamod! 🛠️</span>
          <span className="mr-8 px-4">⚠️ VIKTIGT: Under utveckling kan information vara felaktig eller ofullständig. Vi förbehåller oss rätten att justera priser, villkor och information efterhand. Inga bindande avtal ingås baserat på information under utvecklingsfasen. ⚠️</span>
        </div>
      </div>
    </div>
  )
}