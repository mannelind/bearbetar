import { z } from 'zod'
import { VALIDATION } from '@/lib/constants'

// Helper functions for validation
const isValidSlug = (slug: string) => VALIDATION.slug.pattern.test(slug)

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-post krävs')
    .email('Ogiltig e-postadress')
    .refine(
      (email) => VALIDATION.email.pattern.test(email),
      'Ogiltig e-postadress'
    ),
})

// Article schemas
export const articleSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.title.minLength, 'Titel krävs')
    .max(VALIDATION.title.maxLength, `Max ${VALIDATION.title.maxLength} tecken`),
  
  slug: z
    .string()
    .min(1, 'URL-namn (slug) krävs')
    .refine(isValidSlug, 'Endast små bokstäver, siffror och bindestreck tillåtna'),
  
  content: z
    .string()
    .min(VALIDATION.content.minLength, `Minst ${VALIDATION.content.minLength} tecken krävs`),
  
  excerpt: z
    .string()
    .max(VALIDATION.excerpt.maxLength, `Max ${VALIDATION.excerpt.maxLength} tecken`)
    .optional(),
  
  featured_image: z
    .string()
    .url('Ogiltig URL')
    .optional()
    .or(z.literal('')),
  
  published: z.boolean().default(false),
  
  published_at: z
    .string()
    .datetime()
    .optional()
    .or(z.literal('')),
  
  category_ids: z
    .array(z.string().uuid())
    .optional(),
  
  tag_ids: z
    .array(z.string().uuid())
    .optional(),
})

// Article creation schema (excludes slug generation)
export const createArticleSchema = articleSchema.extend({
  slug: z.string().optional(), // Will be auto-generated from title
})

// Service schemas
export const serviceSchema = z.object({
  title: z
    .string()
    .min(1, 'Titel krävs')
    .max(100, 'Max 100 tecken'),
  
  slug: z
    .string()
    .min(1, 'URL-namn (slug) krävs')
    .refine(isValidSlug, 'Endast små bokstäver, siffror och bindestreck tillåtna'),
  
  description: z
    .string()
    .min(10, 'Minst 10 tecken krävs'),
  
  short_description: z
    .string()
    .max(VALIDATION.shortDescription.maxLength, `Max ${VALIDATION.shortDescription.maxLength} tecken`)
    .optional(),
  
  icon: z
    .string()
    .optional(),
  
  featured_image: z
    .string()
    .url('Ogiltig URL')
    .optional()
    .or(z.literal('')),
  
  price_info: z
    .string()
    .optional(),
  
  active: z.boolean().default(true),
  
  sort_order: z
    .number()
    .int()
    .min(0)
    .default(0),
})

// Service creation schema
export const createServiceSchema = serviceSchema.extend({
  slug: z.string().optional(), // Will be auto-generated from title
})

// Category schemas
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Namn krävs')
    .max(100, 'Max 100 tecken'),
  
  slug: z
    .string()
    .min(1, 'URL-namn (slug) krävs')
    .refine(isValidSlug, 'Endast små bokstäver, siffror och bindestreck tillåtna'),
  
  description: z
    .string()
    .max(500, 'Max 500 tecken')
    .optional(),
})

export const createCategorySchema = categorySchema.extend({
  slug: z.string().optional(), // Will be auto-generated from name
})

// Tag schemas
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Namn krävs')
    .max(50, 'Max 50 tecken'),
  
  slug: z
    .string()
    .min(1, 'URL-namn (slug) krävs')
    .refine(isValidSlug, 'Endast små bokstäver, siffror och bindestreck tillåtna'),
})

export const createTagSchema = tagSchema.extend({
  slug: z.string().optional(), // Will be auto-generated from name
})

// Admin user schemas
export const adminUserSchema = z.object({
  email: z
    .string()
    .min(1, 'E-post krävs')
    .email('Ogiltig e-postadress'),
  
  full_name: z
    .string()
    .max(100, 'Max 100 tecken')
    .optional(),
})

// Search and filter schemas
export const articleFiltersSchema = z.object({
  published: z.boolean().optional(),
  category_id: z.string().uuid().optional(),
  tag_id: z.string().uuid().optional(),
  search: z.string().optional(),
  author_id: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

export const serviceFiltersSchema = z.object({
  active: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

// File upload schema
export const fileUploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.size <= 5 * 1024 * 1024, 'Filen får vara max 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type),
      'Endast JPEG, PNG och WebP tillåtna'
    ),
})

// Export TypeScript types from Zod schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type ArticleFormData = z.infer<typeof articleSchema>
export type CreateArticleFormData = z.infer<typeof createArticleSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type CreateServiceFormData = z.infer<typeof createServiceSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
export type TagFormData = z.infer<typeof tagSchema>
export type CreateTagFormData = z.infer<typeof createTagSchema>
export type AdminUserFormData = z.infer<typeof adminUserSchema>
export type ArticleFilters = z.infer<typeof articleFiltersSchema>
export type ServiceFilters = z.infer<typeof serviceFiltersSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>

// Form error type helper
export type FormErrors<T> = {
  [K in keyof T]?: string[]
}