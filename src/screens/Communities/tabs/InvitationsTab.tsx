import React, { useState } from 'react'
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
import Filter from '../components/Filter'
import ProfAvatar from 'components/ProfAvatar'
import SearchBox from '../components/SearchBox'
import { ProfileStackParams, Invitation } from '../../../../types'
import { useFetchCommunityInvitationsQuery } from 'store/communities-api-slice'

interface InvitationsTabProps {
  communityId: string
}

const InvitationsTab: React.FC<InvitationsTabProps> = ({ communityId }) => {
  const [isEditing, toggleEditing] = useToggle(false)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()
  const {
    data: invitations,
    isFetching,
    isLoading,
  } = useFetchCommunityInvitationsQuery({ id: communityId, filter })

  const handleCancelInvitation = (id: string) => {
    console.log('Cancel invitation:', id)
  }

  const renderInvitation = ({ item }: { item: Invitation }) => (
    <View style={tw`bg-white p-4 border-b border-gray-100`}>
      <View style={tw`flex-row items-start justify-between`}>
        <ProfAvatar
          name={`${item.user.firstName} ${item.user?.lastName?.[0] || ''}`}
          source={item.user.profilePicture || ''}
          size={45}
          subtitle={`Invited by ${item.invitedBy.firstName} ${
            item.invitedBy?.lastName?.[0] || ''
          }`}
          userId={item.user.id}
        />

        <View style={tw`items-end`}>
          <Text style={tw`text-gray-400 text-xs`}>{item.date}</Text>
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
                    profileId: item.user.id || '',
                  })
                }}
                accessoryLeft={<Ionicons name="person" size={15} />}
              />
              <Button
                title="Cancel Invitation"
                appearance="ghost"
                onPress={() => handleCancelInvitation(item.id)}
                accessoryLeft={<Ionicons name="close" size={15} />}
              />
            </View>
          </Popover>
        </View>
      </View>
    </View>
  )

  const EmptyState = () => (
    <View style={tw`flex-1 items-center justify-center p-8`}>
      <View
        style={tw`w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4`}
      >
        <Ionicons name="mail-open-outline" size={40} color="#9CA3AF" />
      </View>
      <Text style={tw`text-gray-900 font-semibold text-lg mb-2`}>
        No Pending Invitations
      </Text>
      <Text style={tw`text-gray-600 text-center text-sm`}>
        When invitation are sent, they'll appear here
      </Text>
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
        data={invitations?.data}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={
          invitations?.data.length === 0 ? tw`flex-1` : tw`pb-4`
        }
      />
    </View>
  )
}

export default InvitationsTab
