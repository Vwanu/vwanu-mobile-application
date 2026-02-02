import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity, Alert } from 'react-native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'

import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useSendFriendRequestMutation,
} from 'store/friends-api-slice'

import tw from '../../lib/tailwind'
import routes from 'navigation/routes'
import { useTheme } from '../../hooks/useTheme'
import { ActivityIndicator } from 'react-native-paper'
import { ProfileStackParams, BottomTabParms } from '../../../types'

export enum ConnectionState {
  FRIENDS = 'friends',
  REQUEST_SENT = 'request_sent',
  REQUEST_RECEIVED = 'request_received',
  NOT_CONNECTED = 'not_connected',
  SELF = 'self',
  LOADING = 'loading',
}

interface ConnectionStatusProps {
  targetUser: Profile
  currentUserId: string
}

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParams, 'Profile'>,
  BottomTabNavigationProp<BottomTabParms>
>
/**
 * ConnectionStatus Component
 * Displays the connection status between current user and profile being viewed
 * Shows appropriate actions based on friendship state
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  targetUser,
  currentUserId,
}) => {
  const { isDarkMode } = useTheme()
  const navigation = useNavigation<NavigationProp>()

  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation()
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation()
  const [declineFriendRequest, { isLoading: isDeclining }] =
    useDeclineFriendRequestMutation()

  // Don't show anything if viewing own profile
  if (targetUser.id === currentUserId) {
    return null
  }

  // Determine connection state between current user and profile being viewed
  const getConnectionState = (): ConnectionState => {
    if (isAccepting || isDeclining) {
      return ConnectionState.LOADING
    }
    if (currentUserId === targetUser?.id) {
      return ConnectionState.SELF
    }
    if (!targetUser.friendship) {
      return ConnectionState.NOT_CONNECTED
    }
    if (targetUser.friendship.status === 1) return ConnectionState.FRIENDS
    else if (targetUser.friendship.status === 0) {
      switch (targetUser.friendship.targetId) {
        case targetUser.id:
          return ConnectionState.REQUEST_SENT
        case currentUserId:
          return ConnectionState.REQUEST_RECEIVED
        default:
          return ConnectionState.NOT_CONNECTED
          break
      }
    }

    return ConnectionState.NOT_CONNECTED
  }
  const handleChatPress = () => {
    // if (onStartChat) {
    //   onStartChat()
    // } else {
    navigation.navigate(routes.INBOX)
    // TODO: Navigate to chat screen
    // }
  }

  const handleCancelRequest = () => {
    Alert.alert(
      'Cancel Friend Request',
      'Are you sure you want to cancel this friend request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Request',
          style: 'destructive',
          onPress: () => {
            if (onCancelRequest) {
              onCancelRequest()
            } else {
              // TODO: Cancel friend request API call
              console.log('Cancel friend request to:', targetUserId)
            }
          },
        },
      ]
    )
  }
  const handleAcceptRequest = async () => {
    acceptFriendRequest({
      requestId: targetUser?.friendship?.id as string,
      targetId: targetUser?.id as string,
    })
  }
  const handleDeclineRequest = async () => {
    declineFriendRequest({
      requestId: targetUser?.friendship?.id as string,
      targetId: targetUser?.id as string,
    })
  }

  const handleSendFriendRequest = async () => {
    sendFriendRequest({ targetId: targetUser?.id as string })
  }

  const connectionState = getConnectionState()

  const renderConnectionContent = () => {
    switch (connectionState) {
      case ConnectionState.SELF:
        return null
      case ConnectionState.LOADING:
        return <ActivityIndicator size="small" />
      case ConnectionState.FRIENDS:
        return (
          <TouchableOpacity
            onPress={handleChatPress}
            style={tw`p-2 mr-2 rounded-full `}
            accessibilityLabel="Start chat"
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        )

      case ConnectionState.REQUEST_RECEIVED:
        return (
          <View style={tw`flex-row items-center`}>
            {/* Accept Button */}
            <TouchableOpacity
              onPress={() => handleAcceptRequest()}
              style={tw`p-2 mr-2 rounded-full ${
                isDarkMode ? 'bg-green-900' : 'bg-green-100'
              }`}
              accessibilityLabel="Accept friend request"
            >
              <Ionicons
                name="checkmark"
                size={20}
                color={isDarkMode ? '#34D399' : '#059669'}
              />
            </TouchableOpacity>

            {/* Decline Button */}
            <TouchableOpacity
              onPress={() => handleDeclineRequest()}
              style={tw`p-2 rounded-full ${
                isDarkMode ? 'bg-red-900' : 'bg-red-100'
              }`}
              accessibilityLabel="Decline friend request"
            >
              <Ionicons
                name="close"
                size={20}
                color={isDarkMode ? '#F87171' : '#DC2626'}
              />
            </TouchableOpacity>

            {/* Badge indicator */}
            <View
              style={tw`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full`}
            />
          </View>
        )

      case ConnectionState.REQUEST_SENT:
        return (
          <TouchableOpacity
            onPress={() => handleCancelRequest()}
            style={tw`p-2 rounded-full`}
            accessibilityLabel="Friend request pending"
          >
            <Ionicons name="hourglass-outline" size={24} />
          </TouchableOpacity>
        )

      case ConnectionState.NOT_CONNECTED:
        return (
          <TouchableOpacity
            onPress={() => handleSendFriendRequest()}
            style={tw`p-2 rounded-full ${
              isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
            }`}
            accessibilityLabel="Send friend request"
          >
            <Ionicons
              name="person-add-outline"
              size={20}
              color={isDarkMode ? '#60A5FA' : '#2563EB'}
            />
          </TouchableOpacity>
        )

      default:
        throw new Error(
          `Unhandled connection state${connectionState satisfies never}`
        )
    }
  }

  //   ----------
  return <View style={tw`items-center`}>{renderConnectionContent()}</View>
}

export default ConnectionStatus
