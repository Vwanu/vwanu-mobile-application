import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'
import { useFetchProfilesQuery } from 'store/profiles'

import PersonList from '../components/PersonList'
import { TabProps } from '../index'

const AllList: React.FC<TabProps> = ({ search }) => {
  const {
    data: profilesData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchProfilesQuery({ search, $limit: 30, $skip: 0 })

  const users: Profile[] = profilesData?.data || []

  const sections = useMemo(() => {
    if (search.trim() || users.length === 0) return []
    const suggested = users.slice(0, 3)
    const mayKnow = users.slice(3)
    const out: { key: string; label: string; data: Profile[] }[] = []
    if (suggested.length > 0)
      out.push({
        key: 'suggested',
        label: 'Suggested for you',
        data: suggested,
      })
    if (mayKnow.length > 0)
      out.push({ key: 'mayKnow', label: 'People you may know', data: mayKnow })
    return out
  }, [users, search])

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
      sections={sections}
      loading={isLoading}
      refreshing={isFetching && !isLoading}
      onRefresh={refetch}
      renderAccessory={renderAccessory}
    />
  )
}

export default AllList
