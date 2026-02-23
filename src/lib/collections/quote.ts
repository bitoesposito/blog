import type { CollectionEntry } from 'astro:content'
import { render } from 'astro:content'
import {
  getAllGeneric,
  getAllAndSubpostsGeneric,
  getByIdGeneric,
  getSubpostsForParentGeneric,
  getSubpostCountGeneric,
  hasSubpostsGeneric,
  getReadingTimeGeneric,
  getCombinedReadingTimeGeneric,
  getAdjacentGeneric,
  isSubpostGeneric,
  getParentIdGeneric,
} from './generic'
import type { TOCSection } from './types'

export async function getAllQuotes(): Promise<CollectionEntry<'quote'>[]> {
  return await getAllGeneric('quote')
}

export async function getAllQuotesAndSubposts(): Promise<
  CollectionEntry<'quote'>[]
> {
  return await getAllAndSubpostsGeneric('quote')
}

/** Index files (e.g. gruppoazzurra/index) are the parent, not a subpost */
export function isQuoteSubpost(quoteId: string | undefined): boolean {
  if (!quoteId) return false
  if (quoteId.endsWith('/index')) return false
  return isSubpostGeneric(quoteId)
}

/** Normalize parent id so that "gruppoazzurra/index" is treated as "gruppoazzurra" for subpost lookup */
function normalizeQuoteParentId(parentId: string): string {
  return parentId.replace(/\/index$/, '')
}

export function getQuoteParentId(subpostId: string): string {
  return getParentIdGeneric(subpostId)
}

export async function getQuoteSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'quote'>[]> {
  return await getSubpostsForParentGeneric('quote', normalizeQuoteParentId(parentId))
}

export async function getQuoteById(
  quoteId: string,
): Promise<CollectionEntry<'quote'> | null> {
  return await getByIdGeneric('quote', quoteId)
}

export async function getQuoteSubpostCount(parentId: string): Promise<number> {
  return await getSubpostCountGeneric('quote', normalizeQuoteParentId(parentId))
}

export async function getQuoteCombinedReadingTime(quoteId: string): Promise<string> {
  return await getCombinedReadingTimeGeneric('quote', quoteId)
}

export async function getQuoteReadingTime(quoteId: string): Promise<string> {
  return await getReadingTimeGeneric('quote', quoteId)
}

export async function hasQuoteSubposts(quoteId: string): Promise<boolean> {
  return await hasSubpostsGeneric('quote', normalizeQuoteParentId(quoteId))
}

export async function getQuoteParentPost(
  subpostId: string,
): Promise<CollectionEntry<'quote'> | null> {
  if (!isSubpostGeneric(subpostId)) return null
  const parentId = getParentIdGeneric(subpostId)
  const byId = await getByIdGeneric('quote', parentId)
  if (byId) return byId as CollectionEntry<'quote'>
  return (await getByIdGeneric('quote', `${parentId}/index`)) as CollectionEntry<'quote'> | null
}

export async function getAdjacentQuotes(currentId: string): Promise<{
  newer: CollectionEntry<'quote'> | null
  older: CollectionEntry<'quote'> | null
  parent: CollectionEntry<'quote'> | null
}> {
  return await getAdjacentGeneric('quote', currentId)
}

/** TOC sections for quote: resolve parent via getQuoteParentPost so index (gruppoazzurra/index) is used */
export async function getQuoteTOCSections(quoteId: string): Promise<TOCSection[]> {
  const post = await getByIdGeneric('quote', quoteId)
  if (!post) return []

  const isSubpost = isQuoteSubpost(quoteId)
  const parentId = isSubpost ? getParentIdGeneric(quoteId) : quoteId
  const parentPost = isSubpost
    ? await getQuoteParentPost(quoteId)
    : (post as CollectionEntry<'quote'>)
  if (!parentPost) return []

  const sections: TOCSection[] = []
  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Overview',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const normalizedParentId = normalizeQuoteParentId(parentId)
  const subposts = await getSubpostsForParentGeneric('quote', normalizedParentId)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
      })
    }
  }

  return sections
}

