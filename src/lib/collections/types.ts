import type { CollectionEntry } from 'astro:content'

/**
 * Supported post collections that can have subposts
 */
export type PostCollection = 'blog' | 'education' | 'quote'

/**
 * Type mapping for CollectionEntry based on collection name
 */
type CollectionEntryMap = {
  blog: CollectionEntry<'blog'>
  education: CollectionEntry<'education'>
  quote: CollectionEntry<'quote'>
}

/**
 * Helper type to get the correct CollectionEntry type from collection name
 */
export type GetCollectionEntry<T extends PostCollection> = CollectionEntryMap[T]

/**
 * TOC heading structure
 */
export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

/**
 * TOC section structure
 */
export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

