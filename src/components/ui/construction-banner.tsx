'use client'

export function ConstructionBanner() {
  return (
    <div 
      className="w-full h-8 bg-amber-500/80 dark:bg-amber-600/80 backdrop-blur-sm overflow-hidden border-b border-amber-400/30 construction-banner z-50"
      style={{
        position: 'fixed !important',
        top: '0 !important',
        left: '0 !important'
      }}
    >
      <div className="flex h-full items-center">
        <div 
          className="whitespace-nowrap text-sm font-medium text-amber-900 dark:text-amber-100 opacity-75 flex"
          style={{
            animation: 'marquee 20s linear infinite'
          }}
        >
          <span className="mr-8">🚧 Ursäkta röran! Denna sida är under utveckling och vissa funktioner kanske inte fungerar som förväntat. Vi arbetar hårt för att förbättra din upplevelse. Tack för ditt tålamod! 🛠️</span>
          <span className="mr-8">🚧 Ursäkta röran! Denna sida är under utveckling och vissa funktioner kanske inte fungerar som förväntat. Vi arbetar hårt för att förbättra din upplevelse. Tack för ditt tålamod! 🛠️</span>
        </div>
      </div>
    </div>
  )
}