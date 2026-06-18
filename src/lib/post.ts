import { SITE } from "@/consts"

/** Formatta una data nel locale del sito, es. "14 gennaio 2026". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

/** Stima i minuti di lettura dal corpo del post (~200 parole/minuto). */
export function readingTime(body = ""): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min di lettura`
}
