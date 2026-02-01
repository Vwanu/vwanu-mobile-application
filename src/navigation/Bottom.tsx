/**
 * Bottom Tab Navigator
 * Main navigation between primary app sections
 */
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components'

import Home from 'assets/svg/Home'
import Chat from 'assets/svg/Chat'
import Profile from 'assets/svg/Profile'
import Users from 'assets/svg/Users'

// Configuration and utilities
import { tabConfig } from './config/navigationConfig'
import { getTabBarStyle, SCREEN_NAMES } from './utils/navigationUtils'
import routes from './routes'

// Hooks and styles
import tw from '../lib/tailwind'
import { useTailwindTheme } from '../hooks/useTailwindTheme'
import { useTheme } from '../hooks/useTheme'

// Navigators
import FeedNavigator from './Feed'
import AccountNavigator from './Account'
import CommunityNavigator from './Community'
import ChatNavigator from './Chat'

// Types
import { BottomTabParms } from '../../types'

const Tab = createBottomTabNavigator<BottomTabParms>()

/**
 * Custom Bottom Tab Bar Component
 * Uses UI Kitten's BottomNavigation with theme support
 */
interface TabBarProps {
  navigation: any
  state: any
}

const BottomTabBar: React.FC<TabBarProps> = ({ navigation, state }) => {
  const { isDarkMode } = useTheme()
  const activeColor = isDarkMode ? 'white' : tw.color('text-primary')
  const inactiveColor = isDarkMode
    ? tw.color('text-secondary')
    : tw.color('text-black')

  const handleTabPress = (index: number) => {
    const routeName = state.routeNames[index]

    // If navigating to Account tab, reset profile parameters to show own profile
    if (routeName === routes.ACCOUNT) {
      navigation.navigate(routeName, {
        screen: routes.PROFILE,
        params: { profileId: undefined },
      })
    } else if (routeName === routes.COMMUNITY) {
      // Always navigate to Communities list when Community tab is pressed
      navigation.navigate(routeName, {
        screen: 'Communities',
      })
    } else {
      navigation.navigate(routeName)
    }
  }
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={handleTabPress}
      indicatorStyle={{ display: 'none' }}
    >
      <BottomNavigationTab
        icon={
          <Home
            stroke={state.index === 0}
            fill={state.index === 0 ? activeColor : inactiveColor}
          />
        }
      />
      <BottomNavigationTab
        icon={
          <Profile
            stroke={state.index === 1}
            fill={state.index === 1 ? activeColor : inactiveColor}
          />
        }
      />
      <BottomNavigationTab
        icon={
          <Users
            fill={state.index === 2 ? activeColor : inactiveColor}
            stroke={state.index === 2}
          />
        }
      />
      <BottomNavigationTab
        icon={
          <Chat
            fill={state.index === 3 ? activeColor : inactiveColor}
            stroke={state.index === 3}
          />
        }
      />
    </BottomNavigation>
  )
}

/**
 * Main Bottom Tab Navigator
 * Provides primary navigation between app sections
 */
const BottomTabNavigator: React.FC = () => {
  const { colors } = useTailwindTheme()

  return (
    <Tab.Navigator
      screenOptions={(route) => ({
        ...tabConfig,
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: getTabBarStyle(route),
      })}
      tabBar={(props) => <BottomTabBar {...props} />}
      initialRouteName={SCREEN_NAMES.FEED_TAB}
    >
      <Tab.Screen
        name={routes.TIMELINE}
        component={FeedNavigator}
        options={{ title: 'Timeline' }}
      />
      <Tab.Screen
        name={routes.ACCOUNT}
        component={AccountNavigator}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name={routes.COMMUNITY}
        component={CommunityNavigator}
        options={{ title: 'Communities' }}
      />
      <Tab.Screen
        name={routes.INBOX}
        component={ChatNavigator}
        options={{ title: 'Messages' }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator
