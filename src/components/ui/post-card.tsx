import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"
import { Tags } from "./tags"
import { formatDate, readingTime } from "@/lib/post"

interface PostCardProps {
  href: string
  title: string
  description?: string
  pubDate: Date
  /** Corpo del contenuto: se presente mostra i minuti di lettura. */
  body?: string
  tags?: string[]
  /** Numero massimo di tag mostrati (default 2). */
  maxTags?: number
}

function PostCard({
  href,
  title,
  description,
  pubDate,
  body,
  tags = [],
  maxTags = 2,
}: PostCardProps) {
  return (
    <a href={href} className="block">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-[1.25]">{title}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-3 leading-[1.25]">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time className="whitespace-nowrap" dateTime={pubDate.toISOString()}>
              {formatDate(pubDate)}
            </time>
            {body != null && (
              <>
                <span aria-hidden="true">|</span>
                <span className="whitespace-nowrap">{readingTime(body)}</span>
              </>
            )}
          </div>
          <Tags tags={tags} max={maxTags} />
        </CardContent>
      </Card>
    </a>
  )
}

export { PostCard }
export type { PostCardProps }
