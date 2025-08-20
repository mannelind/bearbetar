'use client'

export function ConstructionBanner() {
  return (
    <div 
      className="relative w-full h-8 overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--construction-banner) / 0.9)',
        transformOrigin: 'center',
        marginTop: '-2px',
        marginBottom: '-2px',
        width: '105%',
        marginLeft: '-2.5%'
      }}
    >
      <div className="flex h-full items-center">
        <div 
          className="whitespace-nowrap text-sm font-medium flex"
          style={{
            animation: 'marquee 20s linear infinite',
            color: 'hsl(var(--construction-banner-foreground))'
          }}
        >
          <span className="mr-8 px-4">🚧 Ursäkta röran! Denna sida är under utveckling och vissa funktioner kanske inte fungerar som förväntat. Vi arbetar hårt för att förbättra din upplevelse. Tack för ditt tålamod! 🛠️</span>
          <span className="mr-8 px-4">🚧 Ursäkta röran! Denna sida är under utveckling och vissa funktioner kanske inte fungerar som förväntat. Vi arbetar hårt för att förbättra din upplevelse. Tack för ditt tålamod! 🛠️</span>
        </div>
      </div>
    </div>
  )
}