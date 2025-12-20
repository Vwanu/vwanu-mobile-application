import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Popover } from '@ui-kitten/components'
import { ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { View, FlatList, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Button from 'components/Button'
import routes from 'navigation/routes'
import useToggle from 'hooks/useToggle'
import Filter from '../../components/Filter'
import ProfAvatar from 'components/ProfAvatar'
import SearchBox from '../../components/SearchBox'
import { ProfileStackParams, Invitation } from '../../../../../types'
import { useFetchJoinCommunityRequestQuery } from 'store/communities-api-slice'
import NoPost from 'components/EmptyList'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

interface InvitationsTabProps {
  communityId: string
  onError: (
    error: FetchBaseQueryError | SerializedError,
    onRefetch?: () => void
  ) => void
}

const InvitationsTab: React.FC<InvitationsTabProps> = ({
  communityId,
  onError,
}) => {
  const [isEditing, toggleEditing] = useToggle(false)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()
  const {
    data: invitations,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useFetchJoinCommunityRequestQuery({ id: communityId, filter })

  useEffect(() => {
    if (error) {
      console.error('Error fetching join requests:', error)
      onError(error, refetch)
    }
  }, [error, refetch])

  const handleCancelInvitation = (id: string) => {
    console.log('Accepted request:', id)
  }

  const renderInvitation = ({ item }: { item: Invitation }) => (
    <View style={tw`bg-white p-4 border-b border-gray-100`}>
      <View style={tw`flex-row items-start justify-between`}>
        <ProfAvatar
          name={`${item.guest.firstName} ${item.guest?.lastName?.[0] || ''}`}
          source={item.guest.profilePicture || ''}
          size={45}
          subtitle={`Invited by ${item.host.firstName} ${
            item.host?.lastName?.[0] || ''
          }`}
          userId={item.guest.id}
        />

        <View style={tw`items-end`}>
          <Text style={tw`text-gray-400 text-xs`}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
          <Popover
            visible={isEditing}
            anchor={() => (
              <TouchableOpacity onPress={toggleEditing}>
                <Ionicons name="ellipsis-horizontal-outline" size={15} />
              </TouchableOpacity>
            )}
            onBackdropPress={toggleEditing}
            backdropStyle={tw`bg-black/2`}
          >
            <View style={tw`items-start`}>
              <Button
                title="View Profile"
                appearance="ghost"
                onPress={() => {
                  navigation.navigate(routes.PROFILE, {
                    profileId: item.guest.id || '',
                  })
                }}
                accessoryLeft={<Ionicons name="person" size={15} />}
              />
              <Button
                title="Accept Request"
                appearance="ghost"
                onPress={() => handleCancelInvitation(item.id)}
                accessoryLeft={<Ionicons name="checkmark" size={15} />}
              />
            </View>
          </Popover>
        </View>
      </View>
    </View>
  )

  const StatusFilter = ['Pending', 'Approved', 'Rejected']
  const StatusFilterItems = StatusFilter.map((status, index) => ({
    id: index,
    name: status,
  }))

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center justify-around px-2`}>
        <SearchBox
          onSearch={console.log}
          style={tw`flex-grow-1`}
          placeholder="Search invitations..."
        />
        <Filter
          style={tw``}
          items={StatusFilterItems}
          onSelect={(item) => {
            setFilter(item.name)
          }}
        />
      </View>
      {isFetching || (isLoading && <ActivityIndicator />)}
      <FlatList
        data={(invitations?.data || []) as Invitation[]}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <NoPost
            title="No Pending Join request"
            subtitle="When request to join are received, they'll appear here"
          />
        }
        contentContainerStyle={
          (invitations?.data?.length || 0) === 0 ? tw`flex-1` : tw`pb-4`
        }
      />
    </View>
  )
}

export default InvitationsTab
