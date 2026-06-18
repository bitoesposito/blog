import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

interface PaginatorProps {
  currentPage: number
  totalPages: number
  /** Prefisso URL; pagina 1 = baseUrl, le altre = baseUrl/N. Default "/blog". */
  baseUrl?: string
}

function pageHref(base: string, page: number) {
  return page === 1 ? base : `${base}/${page}`
}

/** Pagine da mostrare; usa "ellipsis" solo quando nasconde più di una pagina. */
function pageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const items: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start === 3) items.push(2)
  else if (start > 3) items.push("ellipsis")

  for (let p = start; p <= end; p++) items.push(p)

  if (end === total - 2) items.push(total - 1)
  else if (end < total - 2) items.push("ellipsis")

  items.push(total)
  return items
}

/** Composizione pronta all'uso delle primitive di pagination (link statici, niente JS client). */
function Paginator({ currentPage, totalPages, baseUrl = "/blog" }: PaginatorProps) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages
  const disabled = "pointer-events-none opacity-50"

  return (
    <Pagination>
      <PaginationContent className="flex-wrap gap-1">
        <PaginationItem>
          <PaginationPrevious
            text="Precedente"
            aria-label="Vai alla pagina precedente"
            href={hasPrev ? pageHref(baseUrl, currentPage - 1) : undefined}
            aria-disabled={hasPrev ? undefined : true}
            className={hasPrev ? undefined : disabled}
          />
        </PaginationItem>

        {pageItems(currentPage, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={pageHref(baseUrl, item)}
                isActive={item === currentPage}
                aria-label={
                  item === currentPage
                    ? `Pagina ${item}, pagina corrente`
                    : `Vai alla pagina ${item}`
                }
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            text="Prossima"
            aria-label="Vai alla pagina successiva"
            href={hasNext ? pageHref(baseUrl, currentPage + 1) : undefined}
            aria-disabled={hasNext ? undefined : true}
            className={hasNext ? undefined : disabled}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { Paginator }
export type { PaginatorProps }
