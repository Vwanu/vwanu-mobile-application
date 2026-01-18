import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Popover } from '@ui-kitten/components'
import { ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import {
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { formatDistanceToNow } from 'date-fns'

import tw from 'lib/tailwind'
import Button from 'components/Button'
import routes from 'navigation/routes'
import useToggle from 'hooks/useToggle'
import Filter from '../../components/Filter'
import ProfAvatar from 'components/ProfAvatar'
import SearchBox from '../../components/SearchBox'
import { ProfileStackParams } from '../../../../../types'
import {
  useDeleteCommunityInvitationMutation,
  useFetchCommunityInvitationsQuery,
} from 'store/communities-api-slice'
import NoPost from 'components/EmptyList'
import { useSelector } from 'react-redux'

interface InvitationListProps extends TabInterFace {
  onCreateInvitation: () => void
}

const InvitationList: React.FC<InvitationListProps> = ({
  onCreateInvitation,
  onError,
  communityId,
}) => {
  const [isEditing, toggleEditing] = useToggle(false)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()

  const currentUser = useSelector((state: RootState) => state.auth)
  const [deleteInvitation, { isLoading: deleting, error: deleteError }] =
    useDeleteCommunityInvitationMutation()

  const {
    data: invitations,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useFetchCommunityInvitationsQuery({ id: communityId, filter })

  useEffect(() => {
    if (error) {
      onError(error, refetch)
    }
  }, [error, refetch])

  useEffect(() => {
    if (deleteError) {
      onError(deleteError)
    }
  }, [deleteError])
  // FAB scroll animation
  const scrollY = useRef(0)
  const fabOpacity = useRef(new Animated.Value(1)).current
  const fabTranslateY = useRef(new Animated.Value(0)).current

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollingDown =
      currentScrollY > scrollY.current && currentScrollY > 50

    if (scrollingDown) {
      // Hide FAB when scrolling down
      Animated.parallel([
        Animated.timing(fabOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fabTranslateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else if (currentScrollY < scrollY.current) {
      // Show FAB when scrolling up
      Animated.parallel([
        Animated.timing(fabOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fabTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }

    scrollY.current = currentScrollY
  }

  const handleCancelInvitation = async (invitationId: string) => {
    await deleteInvitation({ invitationId, communityId })
  }

  const renderInvitation = ({ item }: { item: Invitation }) => {
    // Invitation type already specifies profilePicture as string
    const userProfilePicture = item.guest.profilePicture || ''

    return (
      <View style={tw`bg-white p-4 border-b border-gray-100`}>
        <View style={tw`flex-row items-start justify-between`}>
          <View>
            <ProfAvatar
              user={item.guest as User}
              size={40}
              subtitle={`Invited by ${item.host.firstName} ${
                item.host?.lastName?.[0] || ''
              } to be a(n) ${item.communityRole.name.toUpperCase()}\n${formatDistanceToNow(
                item.updatedAt,
                { addSuffix: true }
              )}`}
            />
          </View>

          <View style={tw`items-end`}>
            {/* <Text style={tw`text-black text-xs`}>{item.updatedAt}</Text> */}
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
  }

  const StatusFilter = ['Pending', 'Approved', 'Rejected']
  const StatusFilterItems = StatusFilter.map((status, index) => ({
    id: index.toString(),
    name: status,
  }))
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header with search and filter */}
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

      {/* Invitation List */}
      {isFetching || (isLoading && <ActivityIndicator />)}
      <FlatList
        data={invitations?.data}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <NoPost
            title="No Pending Invitations"
            subtitle="When invitation are sent, they'll appear here"
          />
        }
        contentContainerStyle={
          invitations?.data.length === 0 ? tw`flex-1` : tw`pb-4`
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Floating Action Button */}
      <Animated.View
        style={[
          tw`absolute bottom-6 right-6`,
          {
            opacity: fabOpacity,
            transform: [{ translateY: fabTranslateY }],
            zIndex: 10,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onCreateInvitation}
          style={tw`w-10 h-10 bg-primary rounded-full items-center justify-center shadow-lg`}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default InvitationList
