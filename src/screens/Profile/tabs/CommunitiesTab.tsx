import React from 'react'
import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import routes from 'navigation/routes'
import { TabContentProps } from '../types'
import { useFetchCommunitiesQuery } from 'store/communities-api-slice'
import { ActivityIndicator } from 'react-native-paper'
import {
  CommunityInterface,
  ProfileStackParams,
  BottomTabParms,
} from '../../../../types'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParams, typeof routes.PROFILE>,
  BottomTabNavigationProp<BottomTabParms>
>

const CommunitiesTab: React.FC<TabContentProps> = ({ targetUserId }) => {
  const navigation = useNavigation<NavigationProp>()
  const {
    data: communities = [],
    isLoading,
    isFetching,
  } = useFetchCommunitiesQuery({
    page: 1,
    limit: 20,
    // userId: targetUserId,
  })

  //   console.log(
  //     'Fetched communities:',
  //     communities?.data?.filter((c) => c.IsMember)[0]
  //   )

  const handleCommunityPress = (communityId: string) => {
    navigation.navigate(routes.COMMUNITY, {
      screen: 'CommunityDetail',
      params: { communityId },
    })
  }

  const handleExploreCommunities = () => {
    navigation.navigate(routes.COMMUNITY, {
      screen: 'Communities',
    })
  }

  const renderCommunityItem = ({ item }: { item: CommunityInterface }) => (
    <TouchableOpacity
      style={tw`bg-white dark:bg-gray-800 rounded-lg p-4 mb-3`}
      onPress={() => handleCommunityPress(item.id.toString())}
    >
      <View style={tw`flex-row items-start`}>
        {/* Community Avatar/Icon */}
        <View
          style={tw`w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mr-3`}
        >
          <Image
            source={{ uri: item.profilePicture }}
            style={tw`w-12 h-12 rounded-full`}
          />
        </View>

        {/* Community Info */}
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <Text style={tw`font-semibold text-lg`}>{item.name}</Text>
            {/* @ts-ignore - API returns IsMember with capital I */}
            {item.IsMember && (
              <View
                style={tw`bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full`}
              >
                <Text style={tw`text-green-800 dark:text-green-200 text-xs`}>
                  {item.IsMember.role.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={tw`text-gray-600 dark:text-gray-400 text-sm mb-2`}>
            {item.description}
          </Text>

          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-500 dark:text-gray-500 text-xs`}>
              {item.numMembers?.toLocaleString()} members
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
  // @ts-ignore
  const communitiesList = communities?.data || []

  return (
    <>
      {isLoading || isFetching ? (
        <ActivityIndicator />
      ) : (
        <View style={tw`flex-1`}>
          {communitiesList.length > 0 ? (
            <FlatList
              data={communitiesList}
              renderItem={renderCommunityItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-4`}
            />
          ) : (
            <View style={tw`flex-1 justify-center items-center p-8`}>
              <Ionicons name="globe-outline" size={64} color="#9CA3AF" />
              <Text style={tw`text-gray-500 mt-4 text-center`}>
                No communities joined yet
              </Text>
              <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
                Discover and join communities that interest you
              </Text>
              <Button
                style={tw`mt-4`}
                appearance="outline"
                status="primary"
                onPress={handleExploreCommunities}
              >
                Explore Communities
              </Button>
            </View>
          )}
        </View>
      )}
    </>
  )
}

export default CommunitiesTab
