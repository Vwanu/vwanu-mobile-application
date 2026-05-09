import React from 'react'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Popover } from '@ui-kitten/components'
import { Avatar as PaperAvatar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import tw from 'lib/tailwind'
import { RootState } from 'store'
import Text from 'components/Text'
import ProfileNotFound from './ProfileNotFound'
import { useFetchProfileQuery } from 'store/profiles'
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from 'store/followers-api-slice'
import ConnectionStatus from './ConnectionStatus'
import { useFetchUnreadNotificationsQuery } from 'store/notifications-api-slice'

import useToggle from 'hooks/useToggle'
import ProfileStats from './ProfileStats'
import { cdnImageUrl } from 'lib/cdnImageUrl'

interface ProfileHeaderProps {
  profileId: string
}

interface PillIconButtonProps {
  iconName: React.ComponentProps<typeof Ionicons>['name']
  onPress: () => void
  badge?: number
}

const PillIconButton: React.FC<PillIconButtonProps> = ({
  iconName,
  onPress,
  badge,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={tw`relative w-9 h-9 rounded-full border border-warm-border-strong bg-warm-surface items-center justify-center`}
  >
    <Ionicons name={iconName} size={16} color="#4A4A5E" />
    {badge !== undefined && badge > 0 && (
      <View
        style={tw`absolute -top-1 -right-1 bg-coral rounded-full min-w-4 h-4 border-[1.5px] border-warm-surface items-center justify-center px-1`}
      >
        <Text style={tw`text-white text-[8.5px] font-poppins-bold`}>
          {badge > 9 ? '9+' : String(badge)}
        </Text>
      </View>
    )}
  </TouchableOpacity>
)

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const navigation = useNavigation()
  const { data } = useFetchProfileQuery(props.profileId)
  const { userId } = useSelector((state: RootState) => state.auth)
  const [showAction, toggleShowActions] = useToggle(false)

  const { data: unreadNotifications } = useFetchUnreadNotificationsQuery()
  const unreadCount = unreadNotifications?.data?.length || 0

  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation()

  const user = data
  if (!user) {
    return <ProfileNotFound />
  }

  const isOwnProfile = userId === user.id

  const handleFollowToggle = async () => {
    if (user.isFollowing) {
      await unfollowUser(user.id)
    } else {
      await followUser({ UserId: user.id })
    }
  }

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This feature will be implemented soon.')
  }

  const handleNotificationsPress = () => {
    // @ts-ignore
    navigation.navigate('ACCOUNT', { screen: 'Notifications' })
  }

  const handleSettingsPress = () => {
    // @ts-ignore
    navigation.navigate('Settings')
  }

  const isFollowLoading = isFollowing || isUnfollowing

  return (
    <SafeAreaView edges={['top']} style={tw`bg-white  border-warm-bg border-t`}>
      {/* Row 1: Avatar + action pills */}
      <View style={tw`flex-row justify-between pt-1 px-4 pb-3 `}>
        <View
          style={tw`w-[68px] h-[68px] rounded-full border-2 border-warm-border items-center justify-center overflow-hidden bg-primary-deep-2`}
        >
          {user.profilePicture ? (
            <PaperAvatar.Image
              size={64}
              source={{
                uri: cdnImageUrl(user.profilePicture, {
                  width: 128, // 2x for retina
                  height: 128,
                  smartCrop: true,
                }),
              }}
            />
          ) : (
            <Text style={tw`text-white font-poppins-bold text-lg`}>
              {(user.firstName?.[0] || '').toUpperCase()}
              {(user.lastName?.[0] || '').toUpperCase()}
            </Text>
          )}
        </View>

        {isOwnProfile ? (
          <View style={tw`flex-row items-center gap-2`}>
            <PillIconButton
              iconName="notifications-outline"
              onPress={handleNotificationsPress}
              badge={unreadCount}
            />
            <PillIconButton
              iconName="settings-outline"
              onPress={handleSettingsPress}
            />
          </View>
        ) : (
          <View style={tw`flex-row items-center gap-2`}>
            <ConnectionStatus currentUserId={userId || ''} targetUser={user} />
            <TouchableOpacity
              onPress={handleFollowToggle}
              disabled={isFollowLoading}
              style={tw`px-4 py-2 rounded-full border ${
                user.isFollowing
                  ? 'bg-warm-surface border-warm-border-strong'
                  : 'bg-primary-deep border-primary-deep'
              }`}
            >
              {isFollowLoading ? (
                <ActivityIndicator
                  size="small"
                  color={user.isFollowing ? '#1B1F5E' : '#FFFFFF'}
                />
              ) : (
                <Text
                  style={tw`font-poppins-bold text-xs ${
                    user.isFollowing ? 'text-primary-deep' : 'text-white'
                  }`}
                >
                  {user.isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              )}
            </TouchableOpacity>
            <Popover
              visible={showAction}
              anchor={() => (
                <TouchableOpacity
                  onPress={toggleShowActions}
                  style={tw`w-9 h-9 rounded-full border border-warm-border-strong bg-warm-surface items-center justify-center`}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color="#4A4A5E"
                  />
                </TouchableOpacity>
              )}
              onBackdropPress={toggleShowActions}
            >
              <Text style={tw`p-4`}>some profile actions here ...</Text>
            </Popover>
          </View>
        )}
      </View>

      {/* Row 2: Name + location + bio */}
      <View style={tw`px-4 pb-3`}>
        <Text category="h2" style={tw`font-poppins-bold `}>
          {user.firstName} {user.lastName}
        </Text>
        <View style={tw`flex-row items-center gap-1 mt-1`}>
          <Ionicons name="location-outline" size={12} color="#8A8A9E" />
          <Text appearance="hint" category="c1">
            {user.location || 'Not specified'}
          </Text>
        </View>
        {user.about && (
          <Text style={tw`text-[13.5px] text-soft font-poppins leading-5 mt-2`}>
            {user.about}
          </Text>
        )}
      </View>

      {/* Row 3: Stats */}
      <ProfileStats user={user} />
    </SafeAreaView>
  )
}

export default ProfileHeader
