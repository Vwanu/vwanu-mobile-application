import type { NotificationInterface } from '../../../../types'

export type NavTarget = {
  parent?: string
  to: string
  params?: Record<string, unknown>
}

export type NavResolver = (n: NotificationInterface) => NavTarget | null

// Resolvers — each returns the destination for a category of notification.
// Add a new resolver here, then map it under navForType below.

const post: NavResolver = (n) =>
  n.entityId ? { to: 'SinglePost', params: { postId: n.entityId } } : null

const community: NavResolver = (n) =>
  n.entityId
    ? {
        parent: 'COMMUNITY',
        to: 'CommunityDetail',
        params: { communityId: n.entityId },
      }
    : null

const profile: NavResolver = (n) =>
  n.entityId
    ? {
        parent: 'ACCOUNT',
        to: 'PROFILE',
        params: { profileId: n.entityId },
      }
    : null

export const navForType: Record<string, NavResolver> = {
  like: post,
  comment: post,
  community_invite: community,
  community_join_request: community,
  community_post: community,
  follow: profile,
  user: profile,
}

export const resolveNotificationTarget = (
  notification: NotificationInterface
): NavTarget | null => {
  const resolver = navForType[notification.entityName.toLowerCase()]
  return resolver ? resolver(notification) : null
}
