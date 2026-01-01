import React, { useState } from 'react'
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'
import { useSelector } from 'react-redux'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import ProfAvatar from 'components/ProfAvatar'
import Button from 'components/Button'
import {
  useFetchReceivedFriendRequestsQuery,
  useFetchSentFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useCancelFriendRequestMutation,
} from 'store/friends-api-slice'
import { FriendRequestInterface } from '../../../types'
import { RootState } from '../../store'
import { formatDistanceToNow } from 'date-fns'

const FriendRequestsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const { userId } = useSelector((state: RootState) => state.auth)

  // Fetch friend requests based on active tab
  const {
    data: receivedRequests,
    isLoading: isLoadingReceived,
    isFetching: isFetchingReceived,
    refetch: refetchReceived,
  } = useFetchReceivedFriendRequestsQuery(userId || '', {
    skip: activeTab !== 'received' || !userId,
  })

  const {
    data: sentRequests,
    isLoading: isLoadingSent,
    isFetching: isFetchingSent,
    refetch: refetchSent,
  } = useFetchSentFriendRequestsQuery(userId || '', {
    skip: activeTab !== 'sent' || !userId,
  })

  // Mutations
  const [acceptRequest] = useAcceptFriendRequestMutation()
  const [declineRequest] = useDeclineFriendRequestMutation()
  const [cancelRequest] = useCancelFriendRequestMutation()

  // Computed values
  const currentRequests =
    activeTab === 'received' ? receivedRequests : sentRequests
  const isLoading = activeTab === 'received' ? isLoadingReceived : isLoadingSent
  const isFetching =
    activeTab === 'received' ? isFetchingReceived : isFetchingSent
  const refetch = activeTab === 'received' ? refetchReceived : refetchSent

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId).unwrap()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const handleDeny = async (requestId: string) => {
    try {
      await declineRequest(requestId).unwrap()
    } catch (error) {
      console.error('Error declining friend request:', error)
    }
  }

  const handleCancel = async (requestId: string) => {
    try {
      await cancelRequest(requestId).unwrap()
    } catch (error) {
      console.error('Error canceling friend request:', error)
    }
  }

  const renderReceivedRequest = (item: FriendRequestInterface) => {
    const sender = item.user
    return (
      <View
        key={item.id}
        style={tw`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4`}
      >
        <View style={tw`flex-row items-center`}>
          <ProfAvatar
            name={`${sender?.firstName} ${sender?.lastName}`}
            source={sender?.profilePicture || ''}
            size={50}
            subtitle="Wants to connect with you"
          />
        </View>
        <View style={tw`flex-row mt-3 gap-2`}>
          <Button
            onPress={() => handleAccept(item.id)}
            style={tw`flex-1  p-2 rounded-full border border-2 border-primary `}
            accessoryLeft={() => (
              <Ionicons
                name="checkmark-outline"
                size={16}
                color={tw.color('green-500')}
              />
            )}
            appearance="ghost"
          />
          <Button
            onPress={() => handleDeny(item.id)}
            style={tw`flex-1 p-2 rounded-3xl border border-2 border-primary`}
            accessoryLeft={() => (
              <Ionicons name="close" size={16} color={tw.color('red-500')} />
            )}
            appearance="ghost"
          />
        </View>
      </View>
    )
  }

  const renderSentRequest = (item: FriendRequestInterface) => {
    const target = item.target
    return (
      <View
        key={item.id}
        style={tw`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <ProfAvatar
            name={`${target?.firstName} ${target?.lastName}`}
            subtitle={`Pending friend request\n ${formatDistanceToNow(
              new Date(item.createdAt)
            )}`}
            source={target?.profilePicture || ''}
            size={50}
          />
          <Button
            onPress={() => handleCancel(item.id)}
            style={tw`bg-red-500 rounded-lg`}
            title="Cancel Request"
          />
        </View>
      </View>
    )
  }

  const renderHeader = () => (
    <View
      style={tw`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between p-4`}>
        <Text style={tw`text-2xl font-bold`}>Friend Requests</Text>
      </View>

      {/* Filter Tabs */}
      <View style={tw`flex-row px-4 pb-3`}>
        <TouchableOpacity
          style={tw`mr-4 pb-2 ${
            activeTab === 'received' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('received')}
        >
          <View style={tw`flex-row items-center`}>
            <Text
              style={tw`${
                activeTab === 'received'
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Received
            </Text>
            {receivedRequests && receivedRequests.data.length > 0 && (
              <View
                style={tw`ml-2 bg-blue-500 rounded-full px-2 py-0.5 min-w-5 items-center`}
              >
                <Text style={tw`text-white text-xs font-bold`}>
                  {receivedRequests.data.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`pb-2 ${
            activeTab === 'sent' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('sent')}
        >
          <View style={tw`flex-row items-center`}>
            <Text
              style={tw`${
                activeTab === 'sent'
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Sent
            </Text>
            {sentRequests && sentRequests.data.length > 0 && (
              <View
                style={tw`ml-2 bg-gray-400 dark:bg-gray-600 rounded-full px-2 py-0.5 min-w-5 items-center`}
              >
                <Text style={tw`text-white text-xs font-bold`}>
                  {sentRequests.data.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={tw`flex-1 justify-center items-center p-8 mt-20`}>
      <Ionicons name="people-outline" size={64} color="#9CA3AF" />
      <Text style={tw`text-gray-500 mt-4 text-center text-lg`}>
        {activeTab === 'received'
          ? 'No friend requests'
          : 'No pending requests'}
      </Text>
      <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
        {activeTab === 'received'
          ? "When people send you friend requests, they'll show up here"
          : "When you send friend requests, they'll show up here"}
      </Text>
    </View>
  )

  if (isLoading) {
    return (
      <Screen>
        <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
          {renderHeader()}
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" />
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
        <FlatList
          data={currentRequests?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            activeTab === 'received'
              ? renderReceivedRequest(item)
              : renderSentRequest(item)
          }
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        />
      </View>
    </Screen>
  )
}

export default FriendRequestsScreen
