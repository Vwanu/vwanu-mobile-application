import React from 'react'
import { View, Alert } from 'react-native'
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
import { ActivityIndicator } from 'react-native-paper'
import { ProfileStackParams, BottomTabParams } from '../../../types'
import ActionButton from 'components/ActionButton'

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
  StackNavigationProp<ProfileStackParams, routes.PROFILE>,
  BottomTabNavigationProp<BottomTabParams>
>
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  targetUser,
  currentUserId,
}) => {
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

    return null as unknown as ConnectionState
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
          <ActionButton
            onPress={handleChatPress}
            iconName="chatbubble-ellipses-outline"
            accessibilityLabel="Start chat"
          />
        )

      case ConnectionState.REQUEST_RECEIVED:
        return (
          <View style={tw`flex-row items-center`}>
            {/* Accept Button */}
            <ActionButton
              onPress={() => handleAcceptRequest()}
              iconName="checkmark"
              accessibilityLabel="Accept friend request"
              loading={isDeclining || isAccepting}
              iconStyle={tw`text-green-500 border rounded-full`}
            />

            {/* Decline Button */}
            <ActionButton
              onPress={() => handleDeclineRequest()}
              iconName="close"
              accessibilityLabel="Decline friend request"
              loading={isDeclining || isAccepting}
              iconStyle={tw`text-red-500 border rounded-full`}
            />
          </View>
        )

      case ConnectionState.REQUEST_SENT:
        return (
          <ActionButton
            onPress={() => handleCancelRequest()}
            iconName="hourglass-outline"
            accessibilityLabel="Friend request pending"
          />
        )

      case ConnectionState.NOT_CONNECTED:
        return (
          <ActionButton
            onPress={() => handleSendFriendRequest()}
            iconName="person-add-outline"
            accessibilityLabel="Send friend request"
          />
        )
      case null:
        return null

      default:
        throw new Error(
          `Unhandled connection state${connectionState satisfies never}`
        )
    }
  }

  return <View style={tw`items-center`}>{renderConnectionContent()}</View>
}

export default ConnectionStatus
