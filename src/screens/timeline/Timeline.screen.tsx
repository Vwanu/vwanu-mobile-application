import { useState } from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import PostList from './PostList'
import Screen from 'components/screen'
import CommunityList from './CommunityList'
import PostInput from 'components/CreatePost/PostInput'
import TimelineSkeletone from './TimelineSkeletone'
import TimelineHeader from './TimelineHeader'
import TimelineTabs from './components/TimelineTabs'
import PeopleList from './PeopleList'

const Timeline = () => {
  const [activeTab, setActiveTab] = useState('main')

  return (
    <Screen loading={false} loadingScreen={<TimelineSkeletone />} error={null}>
      <View style={tw`flex-1`}>
        {/* Header with App Name and Notification Bell */}
        <TimelineHeader />

        {/* Tab Navigation */}
        <TimelineTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        {activeTab === 'main' && (
          <View style={tw` p-3 relative`}>
            {/* <BannerList />  */}
            <View style={tw`mt-3`}>
              <PostInput />
            </View>
            <CommunityList />
            <View>
              <PostList />
            </View>
          </View>
        )}

        {/* People Tab */}
        {activeTab === 'people' && <PeopleList />}

        {/* Blogs Tab Placeholder */}
        {activeTab === 'blogs' && (
          <View style={tw`flex-1 items-center justify-center`}>
            {/* Placeholder for Blogs tab content */}
          </View>
        )}
      </View>
    </Screen>
  )
}

export default Timeline
