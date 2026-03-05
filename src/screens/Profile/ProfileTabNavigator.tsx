import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity, ScrollView } from 'react-native'

import tw from '../../lib/tailwind'
import Text from '../../components/Text'
import { useTheme } from '../../hooks/useTheme'
import { TabContentProps, TAB_CONFIGS } from './types'
import {
  PostsTab,
  PicturesTab,
  FriendsTab,
  FollowersTab,
  FollowingTab,
  CommunitiesTab,
  BlogsTab,
} from './tabs'

interface ProfileTabNavigatorProps {
  userId: string | null
  targetUserId: string | null
  navigation: any
}

/**
 * Tab Navigator for Profile screens using custom tab bar
 * This provides scrollable tabs with UI Kitten styling
 */
const ProfileTabNavigator: React.FC<ProfileTabNavigatorProps> = ({
  userId,
  targetUserId,
  navigation: parentNavigation,
}) => {
  const { isDarkMode } = useTheme()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const commonProps: TabContentProps = {
    userId,
    targetUserId,
    user: null, // Will be fetched within each tab component as needed
    navigation: parentNavigation,
  }

  const renderTabContent = () => {
    switch (selectedIndex) {
      case 0:
        return <PostsTab {...commonProps} />
      case 1:
        return <PicturesTab {...commonProps} />
      case 2:
        return <FriendsTab {...commonProps} />
      case 3:
        return <FollowersTab {...commonProps} />
      case 4:
        return <FollowingTab {...commonProps} />
      case 5:
        return <CommunitiesTab {...commonProps} />
      case 6:
        return <BlogsTab {...commonProps} />
      default:
        return <PostsTab {...commonProps} />
    }
  }

  const renderTabButton = (tab: (typeof TAB_CONFIGS)[0], index: number) => {
    const isSelected = selectedIndex === index

    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedIndex(index)}
        style={tw`py-3 px-4 items-center justify-center min-w-20 ${
          isSelected
            ? isDarkMode
              ? 'border-b-2 border-blue-400'
              : 'border-b-2 border-blue-600'
            : ''
        }`}
      >
        <View style={tw`items-center`}>
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={
              isSelected
                ? isDarkMode
                  ? '#60A5FA'
                  : '#2563EB'
                : isDarkMode
                ? '#9CA3AF'
                : '#6B7280'
            }
          />
          <Text
            style={tw`text-sm mt-1 font-poppins ${
              isSelected
                ? isDarkMode
                  ? 'text-blue-400 font-poppins-semibold'
                  : 'text-blue-600 font-poppins-semibold'
                : isDarkMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            {tab.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={tw`flex-1`}>
      {/* Custom Tab Bar - Horizontally Scrollable */}
      <View style={tw`border-b border-gray-200`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row`}
        >
          {TAB_CONFIGS.map((tab, index) => renderTabButton(tab, index))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={tw`flex-1 p-3`}>{renderTabContent()}</View>
    </View>
  )
}

export default ProfileTabNavigator
