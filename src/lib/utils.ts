import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateWordCountFromHtml(
  html: string | null | undefined,
): number {
  if (!html) return 0
  const textOnly = html.replace(/<[^>]+>/g, '')
  return textOnly.split(/\s+/).filter(Boolean).length
}

export function readingTime(wordCount: number): string {
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))
  return `${readingTimeMinutes} min di lettura`
}

export function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: 'ml-4',
    4: 'ml-8',
    5: 'ml-12',
    6: 'ml-16',
  }
  return margins[depth] || ''
}

/**
 * Normalizza un URL per l'uso come canonical URL.
 * - Mantiene il trailing slash per la homepage (/)
 * - Rimuove il trailing slash dalle altre pagine
 * - Rimuove i query params
 *
 * @param url - L'URL da normalizzare (es. Astro.url)
 * @param site - L'URL base del sito (es. Astro.site)
 * @returns Un URL normalizzato senza query params
 */
export function getCanonicalUrl(url: URL, site: URL | string | undefined): URL {
  // Normalizza il pathname: mantieni trailing slash solo per la homepage
  const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')
  
  // Crea un nuovo URL con pathname normalizzato e senza query params
  const canonicalUrl = new URL(pathname, site)
  
  return canonicalUrl
}
