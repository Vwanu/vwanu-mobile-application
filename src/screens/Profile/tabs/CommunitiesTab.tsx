import React from 'react'
import { View, FlatList } from 'react-native'
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
import { ProfileStackParams, BottomTabParms } from '../../../../types'
import CommunityGridCard from 'screens/Communities/components/CommunityGridCard'

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
    limit: 10,
    userId: targetUserId,
  })

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
              renderItem={({ item: community }) => (
                <CommunityGridCard
                  community={community}
                  size="small"
                  onCommunityPress={() =>
                    handleCommunityPress(community.id.toString())
                  }
                />
              )}
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
