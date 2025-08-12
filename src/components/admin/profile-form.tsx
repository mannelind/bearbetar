'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientComponentClient } from '@/lib/supabase'
import { User, Upload, X, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: {
    id: string
    email: string
    full_name: string | null
    bio: string | null
    profile_image: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    bio: user.bio || '',
    profile_image: user.profile_image || ''
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Visa förhandsvisning
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Ladda upp till Supabase Storage
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `profile-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, profile_image: publicUrl }))
      toast.success('Profilbild uppladdad!')

    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Kunde inte ladda upp bilden')
      setPreviewImage(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profile_image: '' }))
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          profile_image: formData.profile_image || null
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profil uppdaterad!')
      window.location.reload()

    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Kunde inte uppdatera profilen')
    } finally {
      setLoading(false)
    }
  }

  const currentImage = previewImage || formData.profile_image

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Min Profil
        </CardTitle>
        <CardDescription>
          Uppdatera din profilinformation och bild
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profilbild */}
          <div className="space-y-4">
            <Label>Profilbild</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {currentImage ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                    <Image
                      src={currentImage}
                      alt="Profilbild"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Laddar upp...' : 'Välj bild'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF upp till 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Namn */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Fullständigt namn</Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Ditt fullständiga namn"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Beskrivning</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Berätta lite om dig själv och din expertis..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Denna beskrivning kommer att visas på Om oss-sidan och bredvid dina blogginlägg.
            </p>
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email">E-postadress</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              E-postadressen kan inte ändras
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