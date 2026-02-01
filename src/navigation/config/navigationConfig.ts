/**
 * Navigation Configuration
 * Centralized configuration for all navigation options
 */

import { StackNavigationOptions } from '@react-navigation/stack'
import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'

/**
 * Common screen options used across navigators
 */
export const commonScreenOptions = {
  headerShown: false,
  headerTransparent: true,
} as const

/**
 * Drawer Navigator Configuration
 */
export const drawerConfig: DrawerNavigationOptions = {
  headerTransparent: true,
  headerTitle: '',
  headerShown: false, // Completely hide header to reclaim space
  swipeEnabled: true, // Enable swipe gestures for drawer access
}

/**
 * Stack Navigator Configuration
 */
export const stackConfig: StackNavigationOptions = {
  headerShown: false, // Hide headers to maximize content space
  headerTransparent: true,
}

/**
 * Bottom Tab Navigator Configuration
 */
export const tabConfig = {
  headerShown: false,
  headerTransparent: true,
  tabBarShowLabel: true,
} as const

/**
 * Screen-specific configurations
 */
export const screenConfigs = {
  timeline: {
    headerTitle: '',
    headerShown: false, // Completely hide header to reclaim all space
  },
  gallery: {
    headerShown: false,
  },
  singlePost: {
    headerShown: false,
  },
  profile: {
    headerShown: false,
    headerTransparent: true,
  },
  chat: {
    headerShown: false,
  },
  message: {
    headerShown: false,
  },
} as const
