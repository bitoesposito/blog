import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Icon } from "./icon"

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: string[]
  /** Numero massimo di tag mostrati; i restanti diventano "+ altri X". Default: tutti. */
  max?: number
}

function Tags({ tags, max = Infinity, className, ...props }: TagsProps) {
  if (tags.length === 0) return null

  const visible = tags.slice(0, max)
  const remaining = tags.length - visible.length

  return (
    <div
      className={cn("flex gap-2 overflow-x-auto whitespace-nowrap", className)}
      {...props}
    >
      {visible.map((tag) => (
        <Badge key={tag} variant="secondary">
          <Icon name="Hash" className="text-muted-foreground" />
          <span className="text-muted-foreground">{tag}</span>
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="secondary">
          <span className="text-muted-foreground">+ altri {remaining}</span>
        </Badge>
      )}
    </div>
  )
}

export { Tags }
export type { TagsProps }
