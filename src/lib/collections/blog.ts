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

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  return await getAllGeneric('blog')
}

export async function getAllPostsAndSubposts(): Promise<
  CollectionEntry<'blog'>[]
> {
  return await getAllAndSubpostsGeneric('blog')
}

export async function getPostById(
  postId: string,
): Promise<CollectionEntry<'blog'> | null> {
  return await getByIdGeneric('blog', postId)
}

export async function getSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'blog'>[]> {
  return await getSubpostsForParentGeneric('blog', parentId)
}

export async function getSubpostCount(parentId: string): Promise<number> {
  return await getSubpostCountGeneric('blog', parentId)
}

export async function hasSubposts(postId: string): Promise<boolean> {
  return await hasSubpostsGeneric('blog', postId)
}

export async function getParentPost(
  subpostId: string,
): Promise<CollectionEntry<'blog'> | null> {
  return await getParentPostGeneric('blog', subpostId)
}

export async function getCombinedReadingTime(postId: string): Promise<string> {
  return await getCombinedReadingTimeGeneric('blog', postId)
}

export async function getPostReadingTime(postId: string): Promise<string> {
  return await getReadingTimeGeneric('blog', postId)
}

export async function getAdjacentPosts(currentId: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  return await getAdjacentGeneric('blog', currentId)
}

export async function getTOCSections(postId: string): Promise<TOCSection[]> {
  return await getTOCSectionsGeneric('blog', postId)
}

export function isSubpost(postId: string): boolean {
  return isSubpostGeneric(postId)
}

export function getParentId(subpostId: string): string {
  return getParentIdGeneric(subpostId)
}

export function groupPostsByYear(
  posts: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

