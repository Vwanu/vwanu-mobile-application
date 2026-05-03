import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'

import tw from '../../lib/tailwind'
import Text from '../../components/Text'
import { TabContentProps, TAB_CONFIGS } from './types'
import {
  PostsTab,
  FriendsTab,
  FollowersTab,
  FollowingTab,
  CommunitiesTab,
  BlogsTab,
} from './tabs'

interface ProfileTabNavigatorProps {
  userId: string | null
  targetUserId: string
  navigation: any
}

/**
 * Tab Navigator for Profile screens using custom tab bar
 */
const ProfileTabNavigator: React.FC<ProfileTabNavigatorProps> = ({
  userId,
  targetUserId,
  navigation: parentNavigation,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const commonProps: TabContentProps = {
    userId,
    targetUserId,
    user: null,
    navigation: parentNavigation,
  }

  const renderTabContent = () => {
    switch (selectedIndex) {
      case 0:
        return <PostsTab {...commonProps} />
      case 1:
        return <FriendsTab {...commonProps} />
      case 2:
        return <FollowersTab {...commonProps} />
      case 3:
        return <FollowingTab {...commonProps} />
      case 4:
        return <CommunitiesTab {...commonProps} />
      case 5:
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
        style={tw`px-4 py-3 ${
          isSelected ? 'border-b-[2.5px] border-primary-deep' : ''
        }`}
      >
        <Text
          style={tw`text-[13px] ${
            isSelected
              ? 'text-primary-deep font-poppins-semibold'
              : 'text-mute font-poppins-medium'
          }`}
        >
          {tab.title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={tw`flex-1`}>
      {/* Text-only horizontally scrollable tab bar */}
      <View style={tw`bg-warm-surface border-b border-warm-border`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row`}
        >
          {TAB_CONFIGS.map((tab, index) => renderTabButton(tab, index))}
        </ScrollView>
      </View>

      {/* Tab Content on warm background */}
      <View style={tw`flex-1 bg-warm-bg px-4 py-2`}>{renderTabContent()}</View>
    </View>
  )
}

export default ProfileTabNavigator
