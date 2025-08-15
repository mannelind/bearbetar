'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientComponentClient } from '@/lib/supabase'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  bucket: string
  path: string
  label?: string
  required?: boolean
  className?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  bucket, 
  path, 
  label = "Bild", 
  required = false,
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
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
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onChange(publicUrl)
      toast.success('Bild uppladdad!')

    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Kunde inte ladda upp bilden')
      setPreviewImage(null)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    onChange(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const currentImage = value || previewImage

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="space-y-4">
        {/* Image Preview */}
        {currentImage && (
          <div className="relative group">
            <div className="aspect-video relative overflow-hidden rounded-lg border bg-muted">
              <Image
                src={currentImage}
                alt="Förhandsvisning"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={removeImage}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Area */}
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={uploading}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : currentImage ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? 'Laddar upp...' : currentImage ? 'Byt bild' : 'Välj bild'}
          </Button>

          {/* URL Input Alternative */}
          <div className="flex-1">
            <Input
              type="url"
              placeholder="Eller ange URL till bild..."
              value={value || ''}
              onChange={(e) => onChange(e.target.value || null)}
              disabled={uploading}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Du kan antingen ladda upp en bild eller ange en URL till en befintlig bild.
        </p>
      </div>
    </div>
  )
}