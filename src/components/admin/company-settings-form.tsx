'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientComponentClient } from '@/lib/supabase'
import { Building2, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CompanySettingsFormProps {
  settings: Record<string, any>
}

export function CompanySettingsForm({ settings }: CompanySettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    about_us_description: settings.about_us_description || 'Vi på Bearbetar hjälper företag att växa och utvecklas genom strategisk rådgivning och praktiska lösningar. Med expertis inom affärsutveckling, ledarskap och innovation hjälper vi våra kunder att nå sina mål.'
  })
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Uppdatera eller skapa om oss-beskrivning
      const { error } = await supabase
        .from('company_settings')
        .upsert(
          {
            key: 'about_us_description',
            value: formData.about_us_description,
            description: 'Allmän beskrivning av företaget för Om oss-sidan'
          },
          {
            onConflict: 'key'
          }
        )

      if (error) throw error

      toast.success('Företagsinställningar uppdaterade!')

    } catch (error) {
      console.error('Error updating company settings:', error)
      toast.error('Kunde inte uppdatera inställningarna')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Företagsinformation
        </CardTitle>
        <CardDescription>
          Hantera allmän information som visas på Om oss-sidan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Om oss beskrivning */}
          <div className="space-y-2">
            <Label htmlFor="about_us_description">Om oss - Beskrivning</Label>
            <Textarea
              id="about_us_description"
              value={formData.about_us_description}
              onChange={(e) => setFormData(prev => ({ ...prev, about_us_description: e.target.value }))}
              placeholder="Beskriv ert företag och er mission..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Denna beskrivning kommer att visas på Om oss-sidan som företagets huvudbeskrivning.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sparar...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Spara ändringar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}