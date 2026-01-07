import { getCollection, type CollectionEntry } from 'astro:content'

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export async function getProjectById(
  projectId: string,
): Promise<CollectionEntry<'projects'> | null> {
  const allProjects = await getAllProjects()
  return allProjects.find((project) => project.id === projectId) || null
}

export async function getAdjacentProjects(
  currentId: string,
): Promise<{
  newer: CollectionEntry<'projects'> | null
  older: CollectionEntry<'projects'> | null
}> {
  const allProjects = await getAllProjects()
  const currentIndex = allProjects.findIndex((project) => project.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null }
  }

  return {
    newer: currentIndex > 0 ? allProjects[currentIndex - 1] : null,
    older:
      currentIndex < allProjects.length - 1
        ? allProjects[currentIndex + 1]
        : null,
  }
}

