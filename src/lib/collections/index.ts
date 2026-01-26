/**
 * Barrel export for all collection utilities
 * Maintains backward compatibility with @/lib/data-utils
 */

// Types
export type { PostCollection, GetCollectionEntry, TOCHeading, TOCSection } from './types'

// Authors
export {
  getAllAuthors,
  getAuthorById,
  parseAuthors,
} from './authors'

// Projects
export {
  getAllProjects,
  getProjectById,
  getAdjacentProjects,
} from './projects'

// Blog
export {
  getAllPosts,
  getAllPostsAndSubposts,
  getPostById,
  getSubpostsForParent,
  getSubpostCount,
  hasSubposts,
  getParentPost,
  getCombinedReadingTime,
  getPostReadingTime,
  getAdjacentPosts,
  getTOCSections,
  isSubpost,
  getParentId,
  groupPostsByYear,
} from './blog'

// Education
export {
  getAllEducation,
  getAllEducationAndSubposts,
  isEducationSubpost,
  getEducationParentId,
  getEducationSubpostsForParent,
  getEducationById,
  getEducationSubpostCount,
  getEducationCombinedReadingTime,
  getEducationReadingTime,
  hasEducationSubposts,
  getEducationParentPost,
  getAdjacentEducation,
  groupEducationByYear,
  getEducationTOCSections,
  getRecentEducation,
} from './education'

// Quote
export {
  getAllQuotes,
  getAllQuotesAndSubposts,
  isQuoteSubpost,
  getQuoteParentId,
  getQuoteSubpostsForParent,
  getQuoteById,
  getQuoteSubpostCount,
  getQuoteCombinedReadingTime,
  getQuoteReadingTime,
  hasQuoteSubposts,
  getQuoteParentPost,
  getAdjacentQuotes,
  getQuoteTOCSections,
} from './quote'

// Tags
export {
  getAllTags,
  getSortedTags,
  getPostsByTag,
  getPostsByAuthor,
  getRecentPosts,
} from './tags'

