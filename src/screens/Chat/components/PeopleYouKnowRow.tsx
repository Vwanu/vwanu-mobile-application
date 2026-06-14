import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { useFetchFriendsQuery } from 'store/friends-api-slice'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import { User } from '../../../../types'
import { useSelector } from 'react-redux'

interface Props {
  onSelect: (user: User) => void
}

const PeopleYouKnowRow: React.FC<Props> = ({ onSelect }) => {
  const { userId } = useSelector((state: RootState) => state.auth)

  const { data } = useFetchFriendsQuery(
    { userId: userId ?? '', status: 1 },
    { skip: !userId }
  )
  const friends = data?.data || []

  if (friends.length === 0) return null
  console.log('rendering PeopleYouKnowRow with friends:', friends.length)
  return (
    <View style={tw`mt-8 px-4`}>
      <Text
        style={tw`px-1 mb-3 text-xs text-center font-poppins-bold text-mute tracking-widest uppercase`}
      >
        Your connections
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-10`}
      >
        {friends.map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => onSelect(user.target)}
            activeOpacity={0.8}
            style={tw`items-center mr-4 w-16`}
          >
            <ProfAvatar
              user={user.target}
              disableDefaultNavigation
              onPress={() => onSelect(user)}
              displayName={false}
            />
            <Text
              style={tw`text-xs font-poppins text-soft mt-1 text-center`}
              numberOfLines={1}
            >
              {user.target.firstName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default PeopleYouKnowRow
