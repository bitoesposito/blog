import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon, type IconName } from "./icon"

const linkVariants = cva(
  "inline-flex cursor-pointer items-center gap-2 text-foreground/70 transition-colors duration-300 ease-in-out hover:text-foreground",
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
  icon?: IconName
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
      {icon && <Icon name={icon} />}
      {children}
      {external && !ariaLabel && (
        <span className="sr-only"> (si apre in una nuova finestra)</span>
      )}
    </a>
  )
}

export { Link, linkVariants }
