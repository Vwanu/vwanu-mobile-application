import React from 'react'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import tw from 'lib/tailwind'
import { RootState } from 'store'
import Text from 'components/Text'
import Button from 'components/Button'
import { useTheme } from 'hooks/useTheme'
import LongText from 'components/LongText'
import ProfAvatar from 'components/ProfAvatar'
import ProfileNotFound from './ProfileNotFound'
import { abbreviateNumber } from 'lib/numberFormat'
import { useFetchProfileQuery } from 'store/profiles'
import ConnectionStatus, { ConnectionState } from './ConnectionStatus'
import NotificationIndicator from 'components/NotificationIndicator'
import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useSendFriendRequestMutation,
} from 'store/friends-api-slice'
import { ActivityIndicator } from 'react-native-paper'

interface ProfileHeaderProps {
  profileId: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const user = useFetchProfileQuery(props.profileId).data
  const { userId } = useSelector((state: RootState) => state.auth)

  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation()
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation()
  const [declineFriendRequest, { isLoading: isDeclining }] =
    useDeclineFriendRequestMutation()

  if (!user) {
    return <ProfileNotFound />
  }

  // Determine connection state between current user and profile being viewed
  const getConnectionState = (): ConnectionState => {
    if (isAccepting || isDeclining) {
      return ConnectionState.LOADING
    }
    if (userId === user?.id) {
      return ConnectionState.SELF
    }
    if (!user.friendship) {
      return ConnectionState.NOT_CONNECTED
    }
    if (user.friendship.status === 1) return ConnectionState.FRIENDS
    else if (user.friendship.status === 0) {
      switch (user.friendship.targetId) {
        case user.id:
          return ConnectionState.REQUEST_SENT
        case userId:
          return ConnectionState.REQUEST_RECEIVED
        default:
          break
      }
    }
  }

  const connectionState = getConnectionState()

  const handleSendFriendRequest = async () => {
    sendFriendRequest({ targetId: user?.id as string })
  }

  const handleAcceptRequest = async () => {
    acceptFriendRequest({
      requestId: user?.friendship?.id as string,
      targetId: user?.id as string,
    })
  }

  const handleDeclineRequest = async () => {
    declineFriendRequest({
      requestId: user?.friendship?.id as string,
      targetId: user?.id as string,
    })
  }

  const handleStartChat = async () => {
    // TODO: Navigate to chat screen with this user
    console.log('Start chat with user:', user?.id)
  }

  const handleUnfriend = async () => {
    // TODO: Implement unfriend API call
    console.log('Unfriend user:', user?.id)
  }

  return (
    <View style={tw`p-3`}>
      {/* Profile Avatar and Action Icons */}
      <View style={tw`flex flex-row justify-between items-center`}>
        <ProfAvatar user={user} disableDefaultNavigation />

        {userId === user?.id ? (
          <View style={tw`flex-row items-center gap-4`}>
            {/* Notification Bell */}
            <NotificationIndicator />

            {/* Settings Icon */}
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
          <>
            {isLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <ConnectionStatus
                targetUserId={user?.id || ''}
                currentUserId={userId || ''}
                connectionState={connectionState}
                onSendRequest={handleSendFriendRequest}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onStartChat={handleStartChat}
                onUnfriend={handleUnfriend}
                isLoading={isAccepting || isDeclining}
              />
            )}
          </>
        )}
      </View>
      {/* Bio */}
      <View style={tw`flex flex-row justify-between mt-3`}>
        <View style={tw`flex-1`}>
          <LongText
            text={
              user?.bio || user?.id === userId
                ? 'Please write a bio'
                : 'Bio coming soon'
            }
            maxLength={
              (process.env.BIO_MAX_LENGTH && +process.env.BIO_MAX_LENGTH) || 200
            }
          />
        </View>

        <View style={tw`flex flex-row justify-between items-center`}>
          <Button
            appearance="ghost"
            accessoryLeft={() => (
              <Ionicons
                name="pencil-outline"
                size={16}
                color={isDarkMode ? 'white' : 'black'}
              />
            )}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={tw`flex flex-row justify-center items-center my-4 gap-8`}>
        <View style={tw`justify-center items-center`}>
          <Text style={tw`font-semibold text-lg`}>
            {abbreviateNumber(user?.amountOfFriends || 0)}
          </Text>
          <Text style={tw`font-thin text-sm`}>Friends</Text>
        </View>
        <View
          style={tw`w-[1px] ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-12`}
        />
        <View style={tw`justify-center items-center`}>
          <Text style={tw`font-semibold text-lg`}>
            {abbreviateNumber(user?.amountOfFollowing || 0)}
          </Text>
          <Text style={tw`font-thin text-sm`}>Following</Text>
        </View>
        <View
          style={tw`w-[1px] ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-12`}
        />
        <View style={tw`justify-center items-center`}>
          <Text style={tw`font-semibold text-lg`}>
            {abbreviateNumber(user?.amountOfFollower || 0)}
          </Text>
          <Text style={tw`font-thin text-sm`}>Followers</Text>
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader
