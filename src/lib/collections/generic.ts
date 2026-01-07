import { getCollection, render } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'
import type { PostCollection, GetCollectionEntry, TOCSection } from './types'

/**
 * Generic function to check if a post ID is a subpost (contains '/')
 * Works for all post collections (blog, education, quote)
 */
export function isSubpostGeneric(postId: string | undefined): boolean {
  if (!postId) return false
  return postId.includes('/')
}

/**
 * Generic function to extract parent ID from subpost ID
 * Works for all post collections (blog, education, quote)
 */
export function getParentIdGeneric(subpostId: string): string {
  return subpostId.split('/')[0]
}

/**
 * Generic function to get all posts from a collection (excluding drafts and subposts)
 */
export async function getAllGeneric<T extends PostCollection>(
  collection: T,
): Promise<GetCollectionEntry<T>[]> {
  const posts = await getCollection(collection)
  return posts
    .filter((post) => !post.data.draft && !isSubpostGeneric(post.id))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()) as GetCollectionEntry<T>[]
}

/**
 * Generic function to get all posts from a collection including subposts (excluding only drafts)
 */
export async function getAllAndSubpostsGeneric<T extends PostCollection>(
  collection: T,
): Promise<GetCollectionEntry<T>[]> {
  const posts = await getCollection(collection)
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()) as GetCollectionEntry<T>[]
}

/**
 * Generic function to get a post by ID from a collection
 */
export async function getByIdGeneric<T extends PostCollection>(
  collection: T,
  postId: string,
): Promise<GetCollectionEntry<T> | null> {
  const allPosts = await getAllAndSubpostsGeneric(collection)
  return (allPosts.find((post) => post.id === postId) || null) as GetCollectionEntry<T> | null
}

/**
 * Generic function to get subposts for a parent post
 */
export async function getSubpostsForParentGeneric<T extends PostCollection>(
  collection: T,
  parentId: string,
): Promise<GetCollectionEntry<T>[]> {
  const posts = await getCollection(collection)
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        isSubpostGeneric(post.id) &&
        getParentIdGeneric(post.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    }) as GetCollectionEntry<T>[]
}

/**
 * Generic function to get subpost count for a parent
 */
export async function getSubpostCountGeneric<T extends PostCollection>(
  collection: T,
  parentId: string,
): Promise<number> {
  const subposts = await getSubpostsForParentGeneric(collection, parentId)
  return subposts.length
}

/**
 * Generic function to check if a post has subposts
 */
export async function hasSubpostsGeneric<T extends PostCollection>(
  collection: T,
  postId: string,
): Promise<boolean> {
  const subposts = await getSubpostsForParentGeneric(collection, postId)
  return subposts.length > 0
}

/**
 * Generic function to get parent post from a subpost ID
 */
export async function getParentPostGeneric<T extends PostCollection>(
  collection: T,
  subpostId: string,
): Promise<GetCollectionEntry<T> | null> {
  if (!isSubpostGeneric(subpostId)) {
    return null
  }

  const parentId = getParentIdGeneric(subpostId)
  const allPosts = await getAllGeneric(collection)
  return (allPosts.find((post) => post.id === parentId) || null) as GetCollectionEntry<T> | null
}

/**
 * Generic function to get reading time for a single post
 */
export async function getReadingTimeGeneric<T extends PostCollection>(
  collection: T,
  postId: string,
): Promise<string> {
  const post = await getByIdGeneric(collection, postId)
  if (!post) return readingTime(0)

  const wordCount = calculateWordCountFromHtml(post.body)
  return readingTime(wordCount)
}

/**
 * Generic function to get combined reading time (post + all subposts)
 */
export async function getCombinedReadingTimeGeneric<T extends PostCollection>(
  collection: T,
  postId: string,
): Promise<string> {
  const post = await getByIdGeneric(collection, postId)
  if (!post) return readingTime(0)

  let totalWords = calculateWordCountFromHtml(post.body)

  if (!isSubpostGeneric(postId)) {
    const subposts = await getSubpostsForParentGeneric(collection, postId)
    for (const subpost of subposts) {
      totalWords += calculateWordCountFromHtml(subpost.body)
    }
  }

  return readingTime(totalWords)
}

/**
 * Generic function to get adjacent posts for navigation
 * Returns newer, older, and parent (if subpost) posts
 */
export async function getAdjacentGeneric<T extends PostCollection>(
  collection: T,
  currentId: string,
): Promise<{
  newer: GetCollectionEntry<T> | null
  older: GetCollectionEntry<T> | null
  parent: GetCollectionEntry<T> | null
}> {
  const allPosts = await getAllGeneric(collection)

  if (isSubpostGeneric(currentId)) {
    const parentId = getParentIdGeneric(currentId)
    const parent = (allPosts.find((post) => post.id === parentId) || null) as GetCollectionEntry<T> | null

    const posts = await getCollection(collection)
    const subposts = posts
      .filter(
        (post) =>
          isSubpostGeneric(post.id) &&
          getParentIdGeneric(post.id) === parentId &&
          !post.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subposts.findIndex((post) => post.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent } as {
        newer: GetCollectionEntry<T> | null
        older: GetCollectionEntry<T> | null
        parent: GetCollectionEntry<T> | null
      }
    }

    return {
      newer:
        currentIndex < subposts.length - 1
          ? (subposts[currentIndex + 1] as GetCollectionEntry<T>)
          : null,
      older: currentIndex > 0 ? (subposts[currentIndex - 1] as GetCollectionEntry<T>) : null,
      parent,
    }
  }

  const parentPosts = allPosts.filter((post) => !isSubpostGeneric(post.id))
  const currentIndex = parentPosts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null } as {
      newer: GetCollectionEntry<T> | null
      older: GetCollectionEntry<T> | null
      parent: GetCollectionEntry<T> | null
    }
  }

  return {
    newer: currentIndex > 0 ? (parentPosts[currentIndex - 1] as GetCollectionEntry<T>) : null,
    older:
      currentIndex < parentPosts.length - 1
        ? (parentPosts[currentIndex + 1] as GetCollectionEntry<T>)
        : null,
    parent: null,
  }
}

/**
 * Generic function to get TOC sections for a post
 * Returns sections including parent overview and all subposts
 */
export async function getTOCSectionsGeneric<T extends PostCollection>(
  collection: T,
  postId: string,
): Promise<TOCSection[]> {
  const post = await getByIdGeneric(collection, postId)
  if (!post) return []

  const parentId = isSubpostGeneric(postId) ? getParentIdGeneric(postId) : postId
  const parentPost = isSubpostGeneric(postId)
    ? await getByIdGeneric(collection, parentId)
    : post

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

  const subposts = await getSubpostsForParentGeneric(collection, parentId)
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

