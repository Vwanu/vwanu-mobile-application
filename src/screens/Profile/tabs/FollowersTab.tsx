/**
 * Followers Tab Component
 * Displays user's followers with follow actions
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '@ui-kitten/components'

// Components
import Text from '../../../components/Text'
import ProfAvatar from '../../../components/ProfAvatar'

// Hooks and utilities
import tw from '../../../lib/tailwind'
import { useFetchProfilesQuery } from '../../../store/profiles'

// Types
import { TabContentProps } from '../types'

const FollowersTab: React.FC<TabContentProps> = ({ user }) => {
  const { data: followers = [] } = useFetchProfilesQuery()

  return (
    <View style={tw`flex-1`}>
      {followers.length > 0 ? (
        <FlatList
          data={followers}
          renderItem={({ item }) => (
            <View
              style={tw`flex-row items-center p-3 border-b border-gray-100`}
            >
              <ProfAvatar user={item} />
              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`font-semibold`}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={tw`text-gray-500 text-sm`}>
                  @{item.firstName?.toLowerCase()}
                </Text>
              </View>
              <Button size="small" appearance="outline">
                Follow
              </Button>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={tw`h-1`} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center p-8`}>
          <Ionicons name="people-outline" size={64} color="#9CA3AF" />
          <Text style={tw`text-gray-500 mt-4 text-center`}>
            {user?.amountOfFollower > 0
              ? 'No followers to show'
              : 'No followers yet'}
          </Text>
          <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
            Start connecting with people
          </Text>
        </View>
      )}
    </View>
  )
}

export default FollowersTab
