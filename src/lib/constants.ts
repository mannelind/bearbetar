// Application constants
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Bearbetar'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Professional business development services'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Article constants
export const ARTICLE_EXCERPT_MAX_LENGTH = 300
export const ARTICLE_TITLE_MAX_LENGTH = 200

// Service constants
export const SERVICE_SHORT_DESCRIPTION_MAX_LENGTH = 200
export const SERVICE_TITLE_MAX_LENGTH = 100

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// UI constants
export const TOAST_DURATION = 5000 // 5 seconds
export const SEARCH_DEBOUNCE_MS = 300

// Admin routes
export const ADMIN_ROUTES = {
  login: '/admin/login',
  dashboard: '/admin',
  articles: '/admin/articles',
  newArticle: '/admin/articles/new',
  editArticle: (id: string) => `/admin/articles/${id}/edit`,
  viewArticle: (id: string) => `/admin/articles/${id}`,
  services: '/admin/services',
  newService: '/admin/services/new',
  editService: (id: string) => `/admin/services/${id}/edit`,
} as const

// Public routes
export const PUBLIC_ROUTES = {
  home: '/',
  blog: '/blog',
  article: (slug: string) => `/blog/${slug}`,
  services: '/tjanster',
  service: (slug: string) => `/tjanster/${slug}`,
} as const

// Error messages
export const ERROR_MESSAGES = {
  unauthorized: 'Du har inte behörighet att komma åt denna sida.',
  notFound: 'Sidan kunde inte hittas.',
  serverError: 'Ett serverfel inträffade. Försök igen senare.',
  networkError: 'Nätverksfel. Kontrollera din internetanslutning.',
  invalidEmail: 'Ogiltig e-postadress.',
  invalidSlug: 'Ogiltigt URL-format (slug).',
  slugExists: 'URL-namnet (slug) används redan.',
  required: 'Detta fält är obligatoriskt.',
  tooLong: (max: number) => `Får vara max ${max} tecken.`,
  emailNotAdmin: 'E-postadressen är inte godkänd för admin-åtkomst.',
  loginRequired: 'Du måste vara inloggad för att komma åt denna sida.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  loginEmailSent: 'Inloggningslänk skickad till din e-post!',
  articleCreated: 'Artikel skapad framgångsrikt.',
  articleUpdated: 'Artikel uppdaterad framgångsrikt.',
  articleDeleted: 'Artikel raderad framgångsrikt.',
  articlePublished: 'Artikel publicerad framgångsrikt.',
  articleUnpublished: 'Artikel avpublicerad framgångsrikt.',
  serviceCreated: 'Tjänst skapad framgångsrikt.',
  serviceUpdated: 'Tjänst uppdaterad framgångsrikt.',
  serviceDeleted: 'Tjänst raderad framgångsrikt.',
  profileUpdated: 'Profil uppdaterad framgångsrikt.',
} as const

// Form validation constants
export const VALIDATION = {
  email: {
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  slug: {
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  title: {
    minLength: 1,
    maxLength: 200,
  },
  content: {
    minLength: 10,
  },
  excerpt: {
    maxLength: 300,
  },
  shortDescription: {
    maxLength: 200,
  },
} as const

// Lucide icon names for services (commonly used ones)
export const AVAILABLE_ICONS = [
  'TrendingUp',
  'Target',
  'Users',
  'BarChart3',
  'Lightbulb',
  'Cog',
  'PieChart',
  'Globe',
  'Shield',
  'Rocket',
  'Heart',
  'Star',
  'Award',
  'CheckCircle',
  'ArrowRight',
  'Play',
  'BookOpen',
  'Building2',
  'Briefcase',
  'Calculator',
] as const

export type AvailableIcon = typeof AVAILABLE_ICONS[number]