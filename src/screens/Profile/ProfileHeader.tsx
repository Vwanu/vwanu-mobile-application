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

interface ProfileHeaderProps {
  profileId: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const user = useFetchProfileQuery(props.profileId).data
  const { userId } = useSelector((state: RootState) => state.auth)

  if (!user) {
    return <ProfileNotFound />
  }

  // Determine connection state between current user and profile being viewed
  const getConnectionState = (): ConnectionState => {
    if (userId === user?.id) {
      return ConnectionState.SELF
    }

    // TODO: Replace with actual API calls to check friendship status
    // For now, using mock logic based on user ID patterns
    const targetId = parseInt(user?.id || '0')
    const currentId = parseInt(userId || '0')

    // Mock logic - replace with real friendship status check
    if (targetId % 4 === 0) {
      return ConnectionState.FRIENDS
    } else if (targetId % 4 === 1) {
      return ConnectionState.REQUEST_RECEIVED
    } else if (targetId % 4 === 2) {
      return ConnectionState.REQUEST_SENT
    } else {
      return ConnectionState.NOT_CONNECTED
    }
  }

  const connectionState = getConnectionState()

  const handleSendRequest = async () => {
    // TODO: Implement send friend request API call
    console.log('Send friend request to user:', user?.id)
  }

  const handleAcceptRequest = async () => {
    // TODO: Implement accept friend request API call
    console.log('Accept friend request from user:', user?.id)
  }

  const handleDeclineRequest = async () => {
    // TODO: Implement decline friend request API call
    console.log('Decline friend request from user:', user?.id)
  }

  const handleCancelRequest = async () => {
    // TODO: Implement cancel friend request API call
    console.log('Cancel friend request to user:', user?.id)
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
        <ProfAvatar
          source={
            typeof user?.profilePicture === 'string'
              ? user.profilePicture
              : user?.profilePicture?.original || ''
          }
          name={`${user?.firstName || ''} ${user?.lastName || ''}`}
          subtitle={user?.email || ''}
          size={50}
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
          <ConnectionStatus
            targetUserId={user?.id || ''}
            currentUserId={userId || ''}
            connectionState={connectionState}
            onSendRequest={handleSendRequest}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onCancelRequest={handleCancelRequest}
            onStartChat={handleStartChat}
            onUnfriend={handleUnfriend}
          />
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
