/**
 * Navigation Utilities
 * Helper functions for navigation logic
 */

import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import routes from '../routes'

/**
 * Determines if the tab bar should be hidden based on current route
 * @param route - Current navigation route
 * @returns boolean indicating if tab bar should be hidden
 */
export const shouldHideTabBar = (route: any): boolean => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? routes.TIMELINE

  // Hide tab bar on these screens
  const hiddenTabBarScreens = [
    'Gallery',
    'SinglePost',
    'Message',
    'BlogDetail',
    'CreateBlog',
  ]

  return hiddenTabBarScreens.includes(routeName)
}

/**
 * Get tab bar display style based on route
 * @param route - Current navigation route
 * @returns Style object for tab bar
 */
export const getTabBarStyle = (route: any) => {
  return shouldHideTabBar(route)
    ? { display: 'none' as const }
    : { display: 'flex' as const }
}

/**
 * Navigation route name constants for type safety
 */
export const SCREEN_NAMES = {
  // Feed Stack
  TIMELINE: 'Timeline',
  GALLERY: 'Gallery',
  SINGLE_POST: 'SinglePost',
  BLOGS: 'Blogs',
  BLOG_DETAIL: 'BlogDetail',
  CREATE_BLOG: 'CreateBlog',

  // Chat Stack
  CHAT: 'Chat',
  MESSAGE: 'Message',

  // Tab Navigator
  FEED_TAB: routes.TIMELINE,
  ACCOUNT_TAB: routes.ACCOUNT,
  INBOX_TAB: routes.INBOX,
  COMMUNITY_TAB: routes.COMMUNITY,
} as const

/**
 * Helper to check if current screen should have full screen content
 * @param routeName - Name of the current route
 * @returns boolean indicating if screen should be full screen
 */
export const isFullScreenRoute = (routeName: string): boolean => {
  const fullScreenRoutes = [SCREEN_NAMES.GALLERY, SCREEN_NAMES.SINGLE_POST]

  return fullScreenRoutes.includes(routeName as any)
}
