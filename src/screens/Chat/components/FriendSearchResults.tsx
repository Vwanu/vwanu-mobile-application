import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import { colors } from 'components/ui/tokens'
import { useFetchFriendsQuery } from 'store/friends-api-slice'
import { User } from '../../../../types'

interface Props {
  searchQuery: string
  onSelect: (user: User) => void
}

const FriendSearchResults: React.FC<Props> = ({ searchQuery, onSelect }) => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data } = useFetchFriendsQuery(
    { userId: userId ?? '', search: searchQuery, status: 1 },
    { skip: !searchQuery.length || !userId }
  )

  if (!data?.data || searchQuery.length === 0) return null

  return (
    <View
      style={[
        tw`mx-4 mb-2 p-3 rounded-card border`,
        {
          backgroundColor: colors.warmSurface,
          borderColor: colors.warmBorder,
        },
      ]}
    >
      {data.data.length === 0 ? (
        <Text style={tw`text-mute font-poppins`}>No users found</Text>
      ) : (
        data.data.map((user: User) => (
          <TouchableOpacity
            key={user.id}
            style={tw`py-2`}
            onPress={() => onSelect(user)}
          >
            <ProfAvatar user={user} disableDefaultNavigation />
          </TouchableOpacity>
        ))
      )}
    </View>
  )
}

export default FriendSearchResults
