import React from 'react'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Popover } from '@ui-kitten/components'

import tw from 'lib/tailwind'
import { RootState } from 'store'
import Text from 'components/Text'
import { useTheme } from 'hooks/useTheme'
import ProfAvatar from 'components/ProfAvatar'
import ProfileNotFound from './ProfileNotFound'
import { useFetchProfileQuery } from 'store/profiles'
import ConnectionStatus from './ConnectionStatus'
import NotificationIndicator from 'components/NotificationIndicator'

import { SafeAreaView } from 'react-native-safe-area-context'
import useToggle from 'hooks/useToggle'
import ProfileStats from './ProfileStats'

interface ProfileHeaderProps {
  profileId: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const { data } = useFetchProfileQuery(props.profileId)
  const { userId } = useSelector((state: RootState) => state.auth)
  const [showAction, toggleShowActions] = useToggle(false)

  const user = data
  if (!user) {
    return <ProfileNotFound />
  }

  const following = false
  return (
    <SafeAreaView
      style={tw`pt-3 px-6 w-full border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`}
    >
      {/* Profile Avatar and Action Icons */}
      <View style={tw`flex flex-row justify-between items-center`}>
        <ProfAvatar
          user={user}
          subtitle={
            userId !== user?.id
              ? `Member since ${new Date(user.createdAt).getFullYear()}`
              : undefined
          }
        />
        {userId === user?.id ? (
          <View style={tw`flex-row items-center gap-4`}>
            {/* Notification Bell */}
            <NotificationIndicator />
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Settings')
              }}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Popover
            visible={showAction}
            anchor={() => (
              <TouchableOpacity onPress={toggleShowActions}>
                <Ionicons
                  name="ellipsis-vertical-outline"
                  size={24}
                  color={isDarkMode ? 'white' : 'black'}
                />
              </TouchableOpacity>
            )}
          >
            <Text style={tw`p-4`}>some profile actions here ...</Text>
          </Popover>
        )}
      </View>
      {/* Profile Bio and Connection Actions */}
      <View style={tw`flex flex-row justify-between items-center mt-2 pr-6`}>
        <View style={tw`w-3/4`}>
          <Text category="p1" style={tw`w-3/4`}>
            {user?.about || 'Encourage them to set a bio!'}
          </Text>
        </View>
        {userId !== user?.id && (
          <View
            style={tw`flex flex-row justify-between items-center mt-2 flex-1 `}
          >
            <ConnectionStatus currentUserId={userId || ''} targetUser={user} />
            <>
              {!user.isFollowing && (
                <TouchableOpacity
                  onPress={() => {}}
                  style={tw`px-3 ml-2 py-1 rounded-full bg-blue-600`}
                >
                  <Text style={tw`text-white font-bold text-xs`}>Follow</Text>
                </TouchableOpacity>
              )}
            </>
          </View>
        )}
      </View>
      {/* Profile Stats */}
      <ProfileStats user={user} />
    </SafeAreaView>
  )
}

export default ProfileHeader
