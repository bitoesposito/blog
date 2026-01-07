import type { CollectionEntry } from 'astro:content'
import {
  getAllGeneric,
  getAllAndSubpostsGeneric,
  getByIdGeneric,
  getSubpostsForParentGeneric,
  getSubpostCountGeneric,
  hasSubpostsGeneric,
  getParentPostGeneric,
  getReadingTimeGeneric,
  getCombinedReadingTimeGeneric,
  getAdjacentGeneric,
  getTOCSectionsGeneric,
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

export function isQuoteSubpost(quoteId: string | undefined): boolean {
  return isSubpostGeneric(quoteId)
}

export function getQuoteParentId(subpostId: string): string {
  return getParentIdGeneric(subpostId)
}

export async function getQuoteSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'quote'>[]> {
  return await getSubpostsForParentGeneric('quote', parentId)
}

export async function getQuoteById(
  quoteId: string,
): Promise<CollectionEntry<'quote'> | null> {
  return await getByIdGeneric('quote', quoteId)
}

export async function getQuoteSubpostCount(parentId: string): Promise<number> {
  return await getSubpostCountGeneric('quote', parentId)
}

export async function getQuoteCombinedReadingTime(quoteId: string): Promise<string> {
  return await getCombinedReadingTimeGeneric('quote', quoteId)
}

export async function getQuoteReadingTime(quoteId: string): Promise<string> {
  return await getReadingTimeGeneric('quote', quoteId)
}

export async function hasQuoteSubposts(quoteId: string): Promise<boolean> {
  return await hasSubpostsGeneric('quote', quoteId)
}

export async function getQuoteParentPost(
  subpostId: string,
): Promise<CollectionEntry<'quote'> | null> {
  return await getParentPostGeneric('quote', subpostId)
}

export async function getAdjacentQuotes(currentId: string): Promise<{
  newer: CollectionEntry<'quote'> | null
  older: CollectionEntry<'quote'> | null
  parent: CollectionEntry<'quote'> | null
}> {
  return await getAdjacentGeneric('quote', currentId)
}

export async function getQuoteTOCSections(quoteId: string): Promise<TOCSection[]> {
  return await getTOCSectionsGeneric('quote', quoteId)
}

