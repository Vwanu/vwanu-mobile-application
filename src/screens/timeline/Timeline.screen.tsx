import { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { SCREEN_NAMES } from 'navigation/utils/navigationUtils'
import PostList from './PostList'
import Screen from 'components/screen'
import CommunityList from './CommunityList'
import PostInput from 'components/CreatePost/PostInput'
import TimelineSkeletone from './TimelineSkeletone'
import TimelineHeader from './TimelineHeader'
import TimelineTabs from './components/TimelineTabs'
import PeopleList from './PeopleList'

const Timeline = () => {
  const navigation = useNavigation()
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

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <View style={tw`flex-1 items-center justify-center p-6`}>
            <Ionicons name="newspaper-outline" size={80} color="#3B82F6" />
            <Text
              style={tw`text-xl font-bold text-gray-900 dark:text-white mt-4 text-center`}
            >
              Discover Blogs
            </Text>
            <Text
              style={tw`text-sm text-gray-500 dark:text-gray-400 mt-2 text-center`}
            >
              Read stories and insights from our community
            </Text>
            <TouchableOpacity
              style={tw`mt-6 bg-primary px-6 py-3 rounded-full flex-row items-center`}
              onPress={() => {
                // @ts-ignore
                navigation.navigate(SCREEN_NAMES.BLOGS)
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-forward" size={20} color="white" />
              <Text style={tw`text-white font-semibold ml-2`}>
                View All Blogs
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  )
}

export default Timeline
