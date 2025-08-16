'use client'

import { cn } from '@/lib/utils'
import DOMPurify from 'isomorphic-dompurify'

interface HtmlContentProps {
  content: string
  className?: string
}

export function HtmlContent({ content, className }: HtmlContentProps) {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote',
      'a', 'img',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class',
      'style', 'target', 'rel'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  })

  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground",
        "prose-img:rounded-md prose-img:shadow-sm",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}