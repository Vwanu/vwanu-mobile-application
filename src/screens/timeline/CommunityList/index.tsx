import React from 'react'
import routes from 'navigation/routes'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Link from 'components/Link'
import { FeedStackParams, BottomTabParms } from '../../../../types'
import { useFetchCommunitiesQuery } from 'store/communities-api-slice'
import CommunityGridCard from 'screens/Communities/components/CommunityGridCard'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<FeedStackParams, 'Feed'>,
  BottomTabNavigationProp<BottomTabParms>
>

const CommunityList = () => {
  const navigation = useNavigation<NavigationProp>()
  const {
    data: communities = [],
    isFetching,
    isLoading,
  } = useFetchCommunitiesQuery({
    page: 1,
    limit: 10,
  })

  const handleCommunityPress = (communityId: string) => {
    navigation.navigate(routes.COMMUNITY, {
      screen: 'CommunityDetail',
      params: { communityId },
    })
  }

  return (
    <>
      {isFetching || isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {
            // @ts-ignore
            communities?.data.length > 0 && (
              <>
                <View
                  style={tw`flex flex-row justify-between items-center
      mt-2 mb-3`}
                >
                  <Text category="h5" style={tw`text-gray-500 font-thin`}>
                    Communities
                  </Text>
                  <Link text="see All" to={routes.COMMUNITY} />
                </View>
                <View style={tw`mb-4`}>
                  <FlatList
                    /* @ts-ignore */
                    data={communities?.data}
                    renderItem={({ item }) => (
                      <CommunityGridCard
                        community={item}
                        size="extra-small"
                        onCommunityPress={() =>
                          handleCommunityPress(item.id.toString())
                        }
                      />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    ItemSeparatorComponent={() => <View style={tw`w-1`} />}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-1`}
                  />
                </View>
              </>
            )
          }
        </>
      )}
    </>
  )
}

export default CommunityList
