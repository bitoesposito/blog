export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  featuredPostCount: number
  postsPerPage: number
  featuredEducationCount: number
}

export type SocialLink = {
  href: string
  label: string
  icon?: string
}

export const SITE: Site = {
  title: 'vito esposito',
  description:
    'blog personale in cui scrivo e condivido le mie idee e pensieri sullo sviluppo software, design e altro.',
  href: 'https://vitoesposito.it',
  author: 'vitoesposito',
  locale: 'it-IT',
  featuredPostCount: 2,
  postsPerPage: 5,
  featuredEducationCount: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'blog',
  },
  {
    href: '/projects',
    label: 'progetti',
  },
  {
    href: '/education',
    label: 'formazione',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/bitoesposito',
    label: 'GitHub',
    icon: 'github'
  },
  {
    href: 'https://www.linkedin.com/in/vitoespo/',
    label: 'LinkedIn',
    icon: 'linkedin'
  },
  {
    href: 'mailto:info@vitoesposito.it',
    label: 'Email',
    icon: 'email'
  },
  {
    href: '/rss.xml',
    label: 'RSS',
    icon: 'rss'
  },
]
