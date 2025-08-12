import { Badge } from '@/components/ui/badge'

// Define tag categories and their colors
const tagColors: Record<string, string> = {
  // Tech & Development
  'Teknik': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Webbutveckling': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'DevOps': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Infrastruktur': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  'Molntjänster': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  
  // Security
  'Säkerhet': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Best Practices': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  
  // AI & Innovation
  'AI': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Maskininlärning': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Innovation': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'Automatisering': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  
  // Business & Strategy
  'Digitalisering': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Småföretag': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Tillväxt': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'Strategi': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'Företagsutveckling': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Processer': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
  'Konsulting': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Rådgivning': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  
  // Team & Management
  'Agile': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'Teamarbete': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'Produktivitet': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'Projektledning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Ledarskap': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
}

const selectedTagColors: Record<string, string> = {
  // Tech & Development
  'Teknik': 'bg-blue-600 text-white',
  'Webbutveckling': 'bg-blue-600 text-white',
  'DevOps': 'bg-blue-600 text-white',
  'Infrastruktur': 'bg-slate-600 text-white',
  'Molntjänster': 'bg-sky-600 text-white',
  
  // Security
  'Säkerhet': 'bg-red-600 text-white',
  'Best Practices': 'bg-orange-600 text-white',
  
  // AI & Innovation
  'AI': 'bg-purple-600 text-white',
  'Maskininlärning': 'bg-purple-600 text-white',
  'Innovation': 'bg-violet-600 text-white',
  'Automatisering': 'bg-indigo-600 text-white',
  
  // Business & Strategy
  'Digitalisering': 'bg-emerald-600 text-white',
  'Småföretag': 'bg-green-600 text-white',
  'Tillväxt': 'bg-teal-600 text-white',
  'Strategi': 'bg-cyan-600 text-white',
  'Företagsutveckling': 'bg-green-600 text-white',
  'Processer': 'bg-lime-600 text-white',
  'Konsulting': 'bg-emerald-600 text-white',
  'Rådgivning': 'bg-teal-600 text-white',
  
  // Team & Management
  'Agile': 'bg-pink-600 text-white',
  'Teamarbete': 'bg-rose-600 text-white',
  'Produktivitet': 'bg-amber-600 text-white',
  'Projektledning': 'bg-yellow-600 text-white',
  'Ledarskap': 'bg-orange-600 text-white',
}

// Function to get tag color
export const getTagColor = (tag: string): string => {
  return tagColors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}

// Function to get selected tag color (darker variant)
export const getSelectedTagColor = (tag: string): string => {
  return selectedTagColors[tag] || 'bg-gray-600 text-white'
}

interface ColoredBadgeProps {
  tag: string
  selected?: boolean
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export function ColoredBadge({ tag, selected = false, className = '', onClick, children }: ColoredBadgeProps) {
  const colorClass = selected ? getSelectedTagColor(tag) : getTagColor(tag)
  
  return (
    <Badge
      className={`border-0 ${colorClass} ${className}`}
      onClick={onClick}
    >
      {children || tag}
    </Badge>
  )
}