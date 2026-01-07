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

export async function getAllEducation(): Promise<CollectionEntry<'education'>[]> {
  return await getAllGeneric('education')
}

export async function getAllEducationAndSubposts(): Promise<
  CollectionEntry<'education'>[]
> {
  return await getAllAndSubpostsGeneric('education')
}

export function isEducationSubpost(postId: string): boolean {
  return isSubpostGeneric(postId)
}

export function getEducationParentId(subpostId: string): string {
  return getParentIdGeneric(subpostId)
}

export async function getEducationSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'education'>[]> {
  return await getSubpostsForParentGeneric('education', parentId)
}

export async function getEducationById(
  postId: string,
): Promise<CollectionEntry<'education'> | null> {
  return await getByIdGeneric('education', postId)
}

export async function getEducationSubpostCount(parentId: string): Promise<number> {
  return await getSubpostCountGeneric('education', parentId)
}

export async function getEducationCombinedReadingTime(postId: string): Promise<string> {
  return await getCombinedReadingTimeGeneric('education', postId)
}

export async function getEducationReadingTime(postId: string): Promise<string> {
  return await getReadingTimeGeneric('education', postId)
}

export async function hasEducationSubposts(postId: string): Promise<boolean> {
  return await hasSubpostsGeneric('education', postId)
}

export async function getEducationParentPost(
  subpostId: string,
): Promise<CollectionEntry<'education'> | null> {
  return await getParentPostGeneric('education', subpostId)
}

export async function getAdjacentEducation(currentId: string): Promise<{
  newer: CollectionEntry<'education'> | null
  older: CollectionEntry<'education'> | null
  parent: CollectionEntry<'education'> | null
}> {
  return await getAdjacentGeneric('education', currentId)
}

export function groupEducationByYear(
  posts: CollectionEntry<'education'>[],
): Record<string, CollectionEntry<'education'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'education'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export async function getEducationTOCSections(postId: string): Promise<TOCSection[]> {
  return await getTOCSectionsGeneric('education', postId)
}

