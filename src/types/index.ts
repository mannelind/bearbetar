import { Database } from './database'

// Database table types
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Service = Database['public']['Tables']['services']['Row']

// Insert types for forms
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']
export type ArticleInsert = Database['public']['Tables']['articles']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type ServiceInsert = Database['public']['Tables']['services']['Insert']

// Update types for forms
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update']
export type ArticleUpdate = Database['public']['Tables']['articles']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type TagUpdate = Database['public']['Tables']['tags']['Update']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

// Extended types with relationships
export interface ArticleWithDetails extends Article {
  author: AdminUser
  categories?: Category[]
  tags?: Tag[]
}

export interface ServiceWithDetails extends Service {
  // Future: Add any relationships if needed
}

// Form types
export interface LoginFormData {
  email: string
}

export interface ArticleFormData {
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published: boolean
  published_at?: string
  category_ids?: string[]
  tag_ids?: string[]
}

export interface ServiceFormData {
  title: string
  slug: string
  description: string
  short_description?: string
  icon?: string
  featured_image?: string
  price_info?: string
  active: boolean
  sort_order: number
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
}

export interface TagFormData {
  name: string
  slug: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface FormState extends LoadingState {
  isSubmitting: boolean
  success?: boolean
}

// Post types
export const POST_TYPES = {
  article: 'artikel',
  business_law: 'affärsrätt',
  strategy: 'strategi',
  rant: 'rant',
  guide: 'guide',
  opinion: 'åsikt',
  analysis: 'analys',
  news: 'nyheter',
  review: 'recension'
} as const

export type PostType = typeof POST_TYPES[keyof typeof POST_TYPES]

export const POST_TYPE_CONFIG = {
  [POST_TYPES.article]: {
    label: 'Artikel',
    emoji: '📰',
    color: 'white',
    description: 'Standardartikel för allmänt innehåll'
  },
  [POST_TYPES.business_law]: {
    label: 'Affärsrätt',
    emoji: '⚖️',
    color: 'blue',
    description: 'Juridiska frågor och affärsrätt'
  },
  [POST_TYPES.strategy]: {
    label: 'Strategi',
    emoji: '🎯',
    color: 'purple',
    description: 'Strategiska analyser och råd'
  },
  [POST_TYPES.rant]: {
    label: 'Rant',
    emoji: '🔥',
    color: 'red',
    description: 'Personliga åsikter och rantar (might delete later)'
  },
  [POST_TYPES.guide]: {
    label: 'Guide',
    emoji: '📚',
    color: 'green',
    description: 'Praktiska guider och instruktioner'
  },
  [POST_TYPES.opinion]: {
    label: 'Åsikt',
    emoji: '💭',
    color: 'orange',
    description: 'Personliga åsikter och perspektiv'
  },
  [POST_TYPES.analysis]: {
    label: 'Analys',
    emoji: '📊',
    color: 'cyan',
    description: 'Djupgående analyser och utredningar'
  },
  [POST_TYPES.news]: {
    label: 'Nyheter',
    emoji: '📡',
    color: 'indigo',
    description: 'Branschnyheter och uppdateringar'
  },
  [POST_TYPES.review]: {
    label: 'Recension',
    emoji: '⭐',
    color: 'pink',
    description: 'Recensioner av produkter eller tjänster'
  }
} as const

// Filter and search types
export interface ArticleFilters {
  published?: boolean
  category_id?: string
  tag_id?: string
  search?: string
  author_id?: string
  post_type?: PostType
}

export interface ServiceFilters {
  active?: boolean
  search?: string
}

// Dashboard stats
export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  totalServices: number
  activeServices: number
  totalCategories: number
  totalTags: number
}