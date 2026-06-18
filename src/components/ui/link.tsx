import { cva, type VariantProps } from "class-variance-authority"
import { MessageCircleQuestion } from "lucide-react"

import { cn } from "@/lib/utils"
import { icons } from "./button"

const linkVariants = cva(
  "inline-flex gap-2 items-center transition-colors duration-300 ease-in-out text-foreground/70 hover:text-foreground cursor-pointer text-md",
  {
    variants: {
      underline: {
        true: "underline decoration-muted-foreground hover:decoration-foreground",
        false: "",
      },
    },
    defaultVariants: {
      underline: false,
    },
  }
)

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string
  external?: boolean
  icon?: keyof typeof icons
}

function Link({
  href,
  external,
  underline,
  icon,
  className,
  "aria-label": ariaLabel,
  title,
  children,
  ...props
}: LinkProps) {
  const Icon = icon ? (icons[icon] ?? MessageCircleQuestion) : null

  const finalAriaLabel =
    external && ariaLabel ? `${ariaLabel} (si apre in una nuova finestra)` : ariaLabel
  const finalTitle =
    title ?? (external && !ariaLabel ? "Link esterno (si apre in una nuova finestra)" : undefined)

  return (
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={finalAriaLabel}
      title={finalTitle}
      className={cn(linkVariants({ underline, className }))}
      {...props}
    >
      {Icon && <Icon className="size-4" aria-hidden="true" />}
      {children}
      {external && !ariaLabel && (
        <span className="sr-only"> (si apre in una nuova finestra)</span>
      )}
    </a>
  )
}

export { Link, linkVariants }
