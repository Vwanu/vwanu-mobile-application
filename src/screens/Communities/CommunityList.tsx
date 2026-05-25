import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import { CommunityStackParams } from '../../../types'
import CategoryTabs from './components/CategoryTabs'
import CommunitiesContent from './components/CommunitiesContent'
import { useFetchInterestsQuery, Interest } from '../../store/interests'
import { useFetchCommunitiesQuery } from '../../store/communities-api-slice'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import EmptyPost from 'components/EmptyList'

interface Props {
  communityListType: 'mine' | 'others'
  searchQuery?: string
}

const CommunityList: React.FC<Props> = ({ communityListType, searchQuery }) => {
  const navigation = useNavigation<NavigationProp<CommunityStackParams>>()
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null
  )
  const { userId } = useSelector((state: RootState) => state.auth)

  const { data: interests, isLoading: interestsLoading } =
    useFetchInterestsQuery()

  // Fetch communities with filters
  const {
    data: communities,
    isLoading: communitiesLoading,
    isFetching,
  } = useFetchCommunitiesQuery({
    page: 1,
    limit: 10,
    search: searchQuery || undefined,
    interestId: selectedInterest?.id || undefined,
    userId: communityListType === 'mine' ? userId || undefined : undefined,
  })

  const handleInterestChange = (interest: Interest) => {
    setSelectedInterest(interest)
  }

  const isLoading = interestsLoading || communitiesLoading
  const hasCommunities = communities?.data && communities.data.length > 0

  // Determine empty state message based on context
  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No communities found for "${searchQuery}"`
    }
    if (communityListType === 'mine') {
      return "You haven't created any communities yet"
    }
    return 'No communities found'
  }

  return (
    <Screen loading={isLoading}>
      <View>
        {interests && interests.length > 0 && (
          <CategoryTabs
            interests={interests}
            selectedInterest={selectedInterest}
            onInterestChange={handleInterestChange}
            tabStyle={tw`border border-red-500 rounded-t-lg`}
            style={tw`h-12 mb-5 mt-3`}
          />
        )}
      </View>

      <Layout style={{ flex: 1 }}>
        {hasCommunities ? (
          <CommunitiesContent communities={communities.data} />
        ) : (
          !isLoading && <EmptyPost title={getEmptyMessage()} />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={tw`absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg`}
          onPress={() => navigation.navigate('CreateCommunity', {})}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Layout>
    </Screen>
  )
}

export default CommunityList
