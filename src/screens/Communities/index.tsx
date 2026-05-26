import React, { useState } from 'react'
import { TabBar, Tab, Layout } from '@ui-kitten/components'
import Screen from 'components/screen'
import CommunityList from './CommunityList'
import ScreenHeader from 'components/ScreenHeader'
import tw from 'lib/tailwind'
import SearchBar from 'components/SearchBar'

type TabType = 'mine' | 'others'

const CommunitiesListNavigator: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>('mine')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleTabSelect = (index: number) => {
    setSelectedTab(index === 0 ? 'mine' : 'others')
  }

  const handleSearchQuery = (text: string) => {
    setSearchQuery(text)
  }

  return (
    <Screen>
      <ScreenHeader
        title="Communities"
        subtitle="Discover . Join. Lead"
        containerStyle={tw`border-t border-warm-border`}
      />
      <SearchBar onSearchChange={handleSearchQuery} />
      <TabBar
        fullWidth
        selectedIndex={selectedTab === 'mine' ? 0 : 1}
        onSelect={handleTabSelect}
        style={tw` border-b border-warm-border border-b`}
      >
        <Tab title="Mine" />
        <Tab title="Others" />
      </TabBar>

      <Layout style={{ flex: 1 }}>
        {selectedTab === 'mine' && (
          <CommunityList communityListType="mine" searchQuery={''} />
        )}
        {selectedTab === 'others' && (
          <CommunityList communityListType="others" searchQuery={''} />
        )}
      </Layout>
    </Screen>
  )
}

export default CommunitiesListNavigator
