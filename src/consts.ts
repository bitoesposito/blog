import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'vito esposito',
  description:
    'blog personale in cui scrivo e condivido le mie idee e pensieri sullo sviluppo software e altro.',
  href: 'https://vitoesposito.it',
  author: 'vitoesposito',
  locale: 'it-IT',
  featuredPostCount: 2,
  postsPerPage: 5,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  }
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/bitoesposito',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/vitoespo/',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:info@vitoesposito.it',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
