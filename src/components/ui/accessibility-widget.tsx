'use client'

import { useState, useEffect } from 'react'
import { Eye, Type, Palette, Highlighter, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'

type ColorBlindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome'

interface AccessibilitySettings {
  highContrast: boolean
  textSize: 'normal' | 'large' | 'extra-large'
  colorBlindMode: ColorBlindMode
  lineHighlight: boolean
}

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    textSize: 'normal',
    colorBlindMode: 'normal',
    lineHighlight: false
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement
    
    // Högkontrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Textstorlek
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large')
    root.classList.add(`text-size-${newSettings.textSize}`)
    
    // Färgblindhetsfilter
    root.setAttribute('data-color-blind-mode', newSettings.colorBlindMode)
    
    // Line highlighting
    if (newSettings.lineHighlight) {
      root.classList.add('line-highlight')
    } else {
      root.classList.remove('line-highlight')
    }
    
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings))
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applySettings(newSettings)
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      textSize: 'normal',
      colorBlindMode: 'normal',
      lineHighlight: false
    }
    setSettings(defaultSettings)
    applySettings(defaultSettings)
  }

  return (
    <>
      {/* Flik-knapp desktop/tablet */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 bottom-20 z-50 bg-primary text-primary-foreground px-2 py-4 rounded-l-lg shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hidden md:block
          ${isOpen ? 'translate-x-full opacity-0 pointer-events-none' : ''}`}
        aria-label="Öppna tillgänglighetsverktyg"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Flik-knapp mobil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-0 top-20 z-50 bg-primary text-primary-foreground px-2 py-4 rounded-r-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden
          ${isOpen ? '-translate-x-full opacity-0 pointer-events-none' : ''}`}
        aria-label="Öppna tillgänglighetsverktyg"
      >
        <Eye className="w-3 h-3" />
      </button>

      {/* Widget-panel desktop/tablet */}
      <div
        className={`fixed bottom-20 z-50 bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out hidden md:block
          ${isOpen ? 'right-0' : '-right-80'}`}
        style={{ width: '320px', maxHeight: '60vh' }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Tillgänglighet</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Stäng"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Innehåll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Högkontrast */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <label className="font-medium">Högkontrast</label>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`w-full py-2 px-4 rounded-md border transition-colors ${
                  settings.highContrast
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {settings.highContrast ? 'På' : 'Av'}
              </button>
            </div>

            {/* Textstorlek */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <label className="font-medium">Textstorlek</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateSetting('textSize', 'normal')}
                  className={`py-2 px-3 rounded-md border text-sm transition-colors ${
                    settings.textSize === 'normal'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('textSize', 'large')}
                  className={`py-2 px-3 rounded-md border text-sm transition-colors ${
                    settings.textSize === 'large'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  Stor
                </button>
                <button
                  onClick={() => updateSetting('textSize', 'extra-large')}
                  className={`py-2 px-3 rounded-md border text-sm transition-colors ${
                    settings.textSize === 'extra-large'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  Extra stor
                </button>
              </div>
            </div>

            {/* Färgblindhetsfilter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <label className="font-medium">Färgblindhetsanpassning</label>
              </div>
              <select
                value={settings.colorBlindMode}
                onChange={(e) => updateSetting('colorBlindMode', e.target.value as ColorBlindMode)}
                className="w-full py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="normal">Normal</option>
                <option value="protanopia">Protanopi (röd)</option>
                <option value="deuteranopia">Deuteranopi (grön)</option>
                <option value="tritanopia">Tritanopi (blå)</option>
                <option value="monochrome">Svartvit</option>
              </select>
            </div>

            {/* Line highlighting */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                <label className="font-medium">Radmarkering</label>
              </div>
              <button
                onClick={() => updateSetting('lineHighlight', !settings.lineHighlight)}
                className={`w-full py-2 px-4 rounded-md border transition-colors ${
                  settings.lineHighlight
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {settings.lineHighlight ? 'På' : 'Av'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={resetSettings}
              className="w-full py-2 px-4 rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Återställ
            </button>
          </div>
        </div>
      </div>

      {/* Widget-panel mobil */}
      <div
        className={`fixed left-0 top-20 z-50 bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '320px', maxHeight: '80vh' }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Tillgänglighet</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Stäng"
            >
              <ChevronLeft className="w-5 h-5 md:block hidden" />
              <ChevronRight className="w-5 h-5 md:hidden block" />
            </button>
          </div>

          {/* Innehåll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Högkontrast */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <label className="font-medium">Högkontrast</label>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`w-full py-2 px-4 rounded-md border transition-colors ${
                  settings.highContrast
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {settings.highContrast ? 'På' : 'Av'}
              </button>
            </div>

            {/* Textstorlek */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <label className="font-medium">Textstorlek</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateSetting('textSize', 'normal')}
                  className={`py-2 px-3 rounded-md border text-sm transition-colors ${
                    settings.textSize === 'normal'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('textSize', 'large')}
                  className={`py-2 px-3 rounded-md border text-sm transition-colors ${
                    settings.textSize === 'large'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  Stor
                </button>
                <button
                  onClick={() => updateSetting('textSize', 'extra-large')}
                  className={`py-2 px-3 rounded-md border text-sm transition-colors ${
                    settings.textSize === 'extra-large'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  Extra stor
                </button>
              </div>
            </div>

            {/* Färgblindhetsfilter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <label className="font-medium">Färgblindhetsanpassning</label>
              </div>
              <select
                value={settings.colorBlindMode}
                onChange={(e) => updateSetting('colorBlindMode', e.target.value as ColorBlindMode)}
                className="w-full py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="normal">Normal</option>
                <option value="protanopia">Protanopi (röd)</option>
                <option value="deuteranopia">Deuteranopi (grön)</option>
                <option value="tritanopia">Tritanopi (blå)</option>
                <option value="monochrome">Svartvit</option>
              </select>
            </div>

            {/* Line highlighting */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                <label className="font-medium">Radmarkering</label>
              </div>
              <button
                onClick={() => updateSetting('lineHighlight', !settings.lineHighlight)}
                className={`w-full py-2 px-4 rounded-md border transition-colors ${
                  settings.lineHighlight
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {settings.lineHighlight ? 'På' : 'Av'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={resetSettings}
              className="w-full py-2 px-4 rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Återställ
            </button>
          </div>
        </div>
      </div>

      {/* Overlay när widgeten är öppen */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}