import React from 'react'
import tw from 'lib/tailwind'
import Text from 'components/Text'
import { Ionicons } from '@expo/vector-icons'
import SettingItem from 'components/SettingItem'
import SettingHeader from 'components/SettingHeadear'
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import routes from 'navigation/routes'
import JoinRequestTab from './JoinRequestTab'

import { CommunityStackParams } from '../../../../../types'
import Button from 'components/Button'

const SettingsTab: React.FC<TabInterFace> = ({ communityId, onError }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)
  const [postsEnabled, setPostsEnabled] = React.useState(true)
  const [showJoinRequests, setShowJoinRequests] = React.useState(false)
  const navigation = useNavigation<StackNavigationProp<CommunityStackParams>>()

  // Show join requests view if active
  if (showJoinRequests) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        {/* Back Button Header */}
        <View style={tw`bg-white px-2 pt-2`}>
          <Button
            appearance="ghost"
            accessoryRight={() => <Ionicons name="arrow-back" size={20} />}
            onPress={() => setShowJoinRequests(false)}
          />
        </View>
        {/* Join Request Content */}
        <JoinRequestTab communityId={communityId} onError={onError} />
      </View>
    )
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      {/* Community Settings */}
      <View style={tw`mt-4`}>
        <SettingHeader title="Community Settings" />
        <SettingItem
          icon="information-circle-outline"
          title="Community Info"
          subtitle="Edit name, description, and cover photo"
          onPress={() =>
            navigation.navigate(routes.CREATE_COMMUNITY, { communityId })
          }
        />
        {/* <SettingItem
          icon="people-outline"
          title="Privacy"
          subtitle="Public community"
          onPress={() => console.log('Privacy settings')}
        /> */}
        <SettingItem
          icon="shield-checkmark-outline"
          title="Member Approval"
          subtitle="Manage join requests"
          onPress={() => setShowJoinRequests(true)}
        />
      </View>

      {/* Notifications */}
      <View style={tw`mt-6`}>
        <SettingHeader title="Notifications" />
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Receive notifications for new posts"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          }
        />
        <SettingItem
          icon="chatbubble-outline"
          title="Post Updates"
          subtitle="Get notified about new posts"
          rightElement={
            <Switch value={postsEnabled} onValueChange={setPostsEnabled} />
          }
        />
      </View>

      {/* Moderation */}
      <View style={tw`mt-6`}>
        <SettingHeader title="Moderation" />
        <SettingItem
          icon="flag-outline"
          title="Reported Content"
          subtitle="View and manage reports"
          onPress={() => console.log('Reported content')}
        />
        <SettingItem
          icon="ban-outline"
          title="Blocked Users"
          subtitle="Manage blocked members"
          onPress={() => console.log('Blocked users')}
        />
      </View>

      {/* Danger Zone */}
      <View style={tw`mt-6 mb-8`}>
        <SettingHeader title="Danger zone" />
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white border-b border-gray-100`}
        >
          <View
            style={tw`w-10 h-10 bg-red-100 rounded-full items-center justify-center`}
          >
            <Ionicons name="exit-outline" size={20} color="#EF4444" />
          </View>
          <View style={tw`flex-1 ml-3`}>
            <Text style={tw`font-semibold text-base text-red-600`}>
              Leave Community
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default SettingsTab
