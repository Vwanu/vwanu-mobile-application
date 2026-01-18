import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Select, SelectItem, IndexPath } from '@ui-kitten/components'
import { ActivityIndicator } from 'react-native-paper'
import { View, FlatList, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import SearchBox from '../../components/SearchBox'
import { useFetchProfilesQuery } from 'store/profiles'
import {
  useSendCommunityInvitationsMutation,
  useFetchCommunityRolesQuery,
} from 'store/communities-api-slice'
import NoPost from 'components/EmptyList'

interface SendInvitationProps extends TabInterFace {
  onCancel: () => void
  onSendInvitations: (userIds: string[]) => void
}

const SendInvitation: React.FC<SendInvitationProps> = ({
  communityId,
  onCancel,
  onSendInvitations,
  onError,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<IndexPath>(
    new IndexPath(0)
  )

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(userSearchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [userSearchQuery])

  // Pass search query to backend - backend will handle searching by email, firstName, lastName, etc.
  const {
    data: allUsers,
    isLoading: isLoadingUsers,
    isFetching,
    error: profilesError,
    refetch: refetchProfiles,
  } = useFetchProfilesQuery(
    { search: debouncedSearchQuery },
    { skip: false } // Always fetch, even with empty search
  )

  // Fetch community roles (general roles, not community-specific)
  const {
    data: communityRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useFetchCommunityRolesQuery()

  // Mutation hook for sending invitations
  const [sendInvitations, { isLoading: isSending }] =
    useSendCommunityInvitationsMutation()

  // Handle query errors with refetch
  useEffect(() => {
    if (profilesError) {
      onError(profilesError, refetchProfiles)
    }
  }, [profilesError])

  useEffect(() => {
    if (rolesError) {
      onError(rolesError, refetchRoles)
    }
  }, [rolesError])

  // Note: Mutation errors are handled in the handleSend catch block
  // to avoid infinite loops and duplicate error handling

  const toggleUserSelection = (userId: string) => {
    const newSelectedUsers = new Set(selectedUsers)
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId)
    } else {
      newSelectedUsers.add(userId)
    }
    setSelectedUsers(newSelectedUsers)
  }

  const handleSend = async () => {
    try {
      if (!communityRoles || communityRoles?.data.length === 0) {
        console.error('No community roles available')
        return
      }

      const userIds = Array.from(selectedUsers)
      const selectedRole = communityRoles?.data[selectedRoleIndex.row]
      const roleId = selectedRole.id

      await sendInvitations({ id: communityId, userIds, roleId }).unwrap()

      // Success - call parent callback and reset state
      onSendInvitations(userIds)
    } catch (error) {
      // Pass error to parent for toast display
      onError(error as any)
    }
  }

  const renderUserToInvite = ({ item }: { item: Profile }) => {
    const isSelected = selectedUsers.has(item.id)
    const profilePictureUrl =
      typeof item.profilePicture === 'string'
        ? item.profilePicture
        : item.profilePicture?.medium || ''

    return (
      <TouchableOpacity
        onPress={() => toggleUserSelection(item.id)}
        style={tw`bg-white p-4 border-b border-gray-100`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <ProfAvatar user={item} size={40} />

          <View
            style={tw`w-6 h-6 rounded-full border-2 ${
              isSelected ? 'bg-primary border-primary' : 'border-gray-300'
            } items-center justify-center`}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Search Bar */}
      <View style={tw`bg-white p-3 border-b border-gray-200 `}>
        <SearchBox
          onSearch={setUserSearchQuery}
          style={tw`border-b-transparent px-0`}
          placeholder="Search users..."
        />

        {/* Role Selector */}
        {isLoadingRoles ? (
          <ActivityIndicator size="small" />
        ) : communityRoles && communityRoles?.data.length > 0 ? (
          <View style={tw`my-2`}>
            <Select
              selectedIndex={selectedRoleIndex}
              value={communityRoles?.data[selectedRoleIndex.row]?.name || ''}
              onSelect={(index) => setSelectedRoleIndex(index as IndexPath)}
            >
              {communityRoles?.data.map((role) => (
                <SelectItem key={role.id} title={role.name.toUpperCase()} />
              ))}
            </Select>
          </View>
        ) : (
          <Text style={tw`text-red-500 text-sm`}>
            Unable to load community roles
          </Text>
        )}
      </View>

      {/* User List */}
      {isLoadingUsers || (isFetching && <ActivityIndicator />)}
      <FlatList
        data={allUsers?.data}
        renderItem={renderUserToInvite}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <NoPost
            title="No Users found"
            subtitle="Try searching with a different name"
          />
        }
        contentContainerStyle={allUsers?.total === 0 ? tw`flex-1` : tw`pb-24`}
      />

      {/* Bottom Action Buttons */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex-row gap-3`,
          { zIndex: 10 },
        ]}
      >
        <TouchableOpacity
          onPress={onCancel}
          style={tw`flex-1 py-3 bg-gray-200 rounded-lg items-center justify-center`}
        >
          <Text style={tw`text-gray-800 font-semibold text-base`}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSend}
          disabled={
            selectedUsers.size === 0 ||
            isSending ||
            isLoadingRoles ||
            !communityRoles ||
            communityRoles?.data.length === 0
          }
          style={tw`flex-1 py-3 rounded-lg items-center justify-center ${
            selectedUsers.size === 0 ||
            isSending ||
            isLoadingRoles ||
            !communityRoles ||
            communityRoles?.data.length === 0
              ? 'bg-gray-300'
              : 'bg-primary'
          }`}
        >
          {isSending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={tw`font-semibold text-base ${
                selectedUsers.size === 0 ||
                isLoadingRoles ||
                !communityRoles ||
                communityRoles?.data.length === 0
                  ? 'text-gray-500'
                  : 'text-white'
              }`}
            >
              Send Invitations ({selectedUsers.size})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SendInvitation
