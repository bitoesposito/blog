import { SITE } from "@/consts"

/** Formatta una data nel locale del sito, es. "14 gennaio 2026". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    // pubDate è coerced come mezzanotte UTC: formatto in UTC per non slittare di un giorno.
    timeZone: "UTC",
  }).format(date)
}

/** Stima i minuti di lettura dal corpo del post (~200 parole/minuto). */
export function readingTime(body = ""): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min di lettura`
}

/**
 * Raggruppa le entry per anno di pubblicazione, in ordine di anno decrescente.
 * L'ordine interno a ciascun anno riflette quello dell'array in ingresso.
 */
export function groupByYear<T extends { data: { pubDate: Date } }>(
  entries: T[]
): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const entry of entries) {
    const year = String(entry.data.pubDate.getUTCFullYear())
    const bucket = groups.get(year) ?? []
    bucket.push(entry)
    groups.set(year, bucket)
  }
  return [...groups.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}
