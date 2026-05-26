import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'
import { useFetchProfilesQuery } from 'store/profiles'

import PersonList from '../components/PersonList'
import { TabProps } from '../index'

const SuggestedList: React.FC<TabProps> = ({ search }) => {
  const {
    data: profilesData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchProfilesQuery({ search, $limit: 30, $skip: 0 })

  const users: Profile[] = profilesData?.data || []

  const renderAccessory = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        tw`px-3 py-2 rounded-full`,
        { backgroundColor: colors.primarySoft },
      ]}
    >
      <Ionicons name="person-add" size={16} color={colors.primaryDeep} />
    </TouchableOpacity>
  )

  return (
    <PersonList<Profile>
      items={users}
      getProfile={(u) => u}
      loading={isLoading}
      refreshing={isFetching && !isLoading}
      onRefresh={refetch}
      emptyTitle="No suggestions right now"
      emptySubtitle="Check back later"
      renderAccessory={renderAccessory}
    />
  )
}

export default SuggestedList
