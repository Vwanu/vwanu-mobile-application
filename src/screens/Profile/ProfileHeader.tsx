import React from 'react'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
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
import { SafeAreaView } from 'react-native-safe-area-context'

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

  const defaultBackground =
    'https://plus.unsplash.com/premium_photo-1686255006386-5f58b00ffe9d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D'
  return (
    <ImageBackground
      source={{ uri: user.coverPicture ?? defaultBackground }}
      style={tw`w-full`}
      resizeMode="cover"
    >
      <SafeAreaView style={tw`p-2`}>
        {/* Profile Avatar and Action Icons */}
        <View style={tw`flex flex-row justify-between items-center`}>
          <ProfAvatar
            user={user}
            titleStyles={tw`text-white bg-black bg-opacity-50 rounded font-semibold`}
            subtitleParams={{
              textStyles: `text-white bg-black bg-opacity-50 rounded font-semibold`,
            }}
          />

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
                  isLoading={isAccepting || isDeclining}
                />
              )}
            </>
          )}
        </View>
        <View style={tw`flex flex-row justify-center items-center my-4 gap-8`}>
          <View style={tw`justify-center items-center`}>
            <Text style={[tw`font-semibold text-lg`, whiteShadowStyle]}>
              {abbreviateNumber(user?.amountOfFriends || 0)}
            </Text>
            <Text style={[tw`font-thin text-sm`, whiteShadowStyle]}>
              Friends
            </Text>
          </View>
          <View
            style={tw`w-[1px] ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            } h-12`}
          />
          <View style={tw`justify-center items-center`}>
            <Text style={[tw`font-semibold text-lg`, whiteShadowStyle]}>
              {abbreviateNumber(user?.amountOfFollowing || 0)}
            </Text>
            <Text style={[tw`font-thin text-sm`, whiteShadowStyle]}>
              Following
            </Text>
          </View>
          <View
            style={tw`w-[1px] ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            } h-12`}
          />
          <View style={tw`justify-center items-center`}>
            <Text style={[tw`font-semibold text-lg`, whiteShadowStyle]}>
              {abbreviateNumber(user?.amountOfFollower || 0)}
            </Text>
            <Text style={[tw`font-thin text-sm`, whiteShadowStyle]}>
              Followers
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const whiteShadowStyle = {
  shadowColor: '#FFFFFF',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  color: 'white',
}

export default ProfileHeader
