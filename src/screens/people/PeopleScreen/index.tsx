import React, { useState } from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import ScreenHeader from 'components/ScreenHeader'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { colors } from 'components/ui/tokens'

import AllList from './tabs/AllList'
import FriendsList from './tabs/FriendsList'
import SuggestedList from './tabs/SuggestedList'
import PendingList from './tabs/PendingList'
import FollowingList from './tabs/FollowingList'
import SearchBar from 'components/SearchBar'
import useDebounce from 'hooks/useDebounce'

const FILTERS: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'friends', label: 'Friends' },
  { id: 'suggested', label: 'Suggested' },
  { id: 'pending', label: 'Pending' },
  { id: 'following', label: 'Following' },
]

export interface TabProps {
  search: string
}

const TABS: Record<string, React.FC<TabProps>> = {
  all: AllList,
  friends: FriendsList,
  suggested: SuggestedList,
  pending: PendingList,
  following: FollowingList,
}

const PeopleScreen: React.FC = () => {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const debouncedSearch = useDebounce(search)

  const ActiveTab = TABS[activeFilter] || AllList

  return (
    <Screen>
      <View style={tw`flex-1`}>
        <ScreenHeader title="People" subtitle="Find friends · Connect · Grow" />
        <SearchBar onSearchChange={setSearch} />
        <TabBar
          tabs={FILTERS}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
          isPill
          style={tw`mb-3`}
        />
        <View style={tw`flex-1 mt-3`}>
          <ActiveTab search={debouncedSearch} />
        </View>
      </View>
    </Screen>
  )
}

export default PeopleScreen
