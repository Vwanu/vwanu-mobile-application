import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity, Alert } from 'react-native'

import tw from '../../lib/tailwind'
import { useTheme } from '../../hooks/useTheme'
import { ActivityIndicator } from 'react-native-paper'

export enum ConnectionState {
  FRIENDS = 'friends',
  REQUEST_SENT = 'request_sent',
  REQUEST_RECEIVED = 'request_received',
  NOT_CONNECTED = 'not_connected',
  SELF = 'self',
  LOADING = 'loading',
}

interface ConnectionStatusProps {
  targetUserId: string
  currentUserId: string
  isLoading?: boolean
  connectionState: ConnectionState
  onSendRequest: () => void
  onAcceptRequest: () => void
  onDeclineRequest: () => void
  onCancelRequest?: () => void
  onStartChat?: () => void
}

/**
 * ConnectionStatus Component
 * Displays the connection status between current user and profile being viewed
 * Shows appropriate actions based on friendship state
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  targetUserId,
  currentUserId,
  connectionState,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
  onStartChat,
}) => {
  const { isDarkMode } = useTheme()

  // Don't show anything if viewing own profile
  if (
    connectionState === ConnectionState.SELF ||
    targetUserId === currentUserId
  ) {
    return null
  }

  const handleChatPress = () => {
    if (onStartChat) {
      onStartChat()
    } else {
      // TODO: Navigate to chat screen
      console.log('Navigate to chat with user:', targetUserId)
    }
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

  const renderConnectionContent = () => {
    switch (connectionState) {
      case ConnectionState.LOADING:
        return <ActivityIndicator size="small" />
      case ConnectionState.FRIENDS:
        return (
          <TouchableOpacity
            onPress={handleChatPress}
            style={tw`p-2 mr-2 rounded-full ${
              isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
            }`}
            accessibilityLabel="Start chat"
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={isDarkMode ? '#60A5FA' : '#2563EB'}
            />
          </TouchableOpacity>
        )

      case ConnectionState.REQUEST_RECEIVED:
        return (
          <View style={tw`flex-row items-center`}>
            {/* Accept Button */}
            <TouchableOpacity
              onPress={() => onAcceptRequest()}
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
              onPress={() => onDeclineRequest()}
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
            onPress={handleCancelRequest}
            style={tw`p-2 rounded-full ${
              isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
            }`}
            accessibilityLabel="Friend request pending"
          >
            <Ionicons
              name="hourglass-outline"
              size={20}
              color={isDarkMode ? '#FBBF24' : '#D97706'}
            />
          </TouchableOpacity>
        )

      case ConnectionState.NOT_CONNECTED:
        return (
          <TouchableOpacity
            onPress={() => onSendRequest()}
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
        return null
    }
  }

  return <View style={tw`items-center`}>{renderConnectionContent()}</View>
}

export default ConnectionStatus
