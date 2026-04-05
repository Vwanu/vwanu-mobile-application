/**
 * Shared types for Profile tab components
 */

export interface TabContentProps {
  userId: string | null
  targetUserId: string | null
  user: any // TODO: Replace with proper User type when available
  navigation: any // TODO: Replace with proper navigation type
}

export interface TabConfig {
  title: string
  icon: string
}

export const TAB_CONFIGS: TabConfig[] = [
  { title: 'Posts', icon: 'document-text-outline' },
  { title: 'Pictures', icon: 'images-outline' },
  { title: 'Friends', icon: 'people-outline' },
  { title: 'Followers', icon: 'heart-outline' },
  { title: 'Following', icon: 'person-add-outline' },
  { title: 'Communities', icon: 'globe-outline' },
  { title: 'Blogs', icon: 'library-outline' },
]
