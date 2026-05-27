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

  const handleTabChange = (id: string) => {
    if (id === 'forums') {
      // @ts-ignore
      navigation.navigate('Forum')
      return
    }
    if (id === 'people') {
      // @ts-ignore
      navigation.navigate('People')
      return
    }
    setActiveTab(id)
  }

  return (
    <Screen loading={false} loadingScreen={<TimelineSkeletone />} error={null}>
      <View style={tw`flex-1 bg-warm-bg`}>
        {/* Header with App Name and Notification Bell */}
        <TimelineHeader />

        {/* Tab Navigation */}
        <TimelineTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main Content */}
        {activeTab === 'main' && (
          <View style={tw`p-3 relative`}>
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
            <Ionicons
              name="newspaper-outline"
              size={50}
              style={tw`bg-white p-5 rounded-full shadow`}
            />
            <Text
              style={tw`text-4xl font-syne-bold font-bold text-ink mt-4 text-center`}
            >
              Discover Blogs
            </Text>
            <Text style={tw`ont-poppins mt-2 text-center`}>
              Read stories and insights from
              <Text style={tw` font-poppins mt-2 text-center`}></Text>
            </Text>
            <Text style={tw`font-poppins mt-2 text-center`}>
              people across the Vwanu
            </Text>
            <Text style={tw` px-15 text-soft font-poppins mt-2 text-center`}>
              community
            </Text>
            <TouchableOpacity
              style={tw`mt-6 justify-center  items-center  align-middle bg-primary-deep w-[90%] px-6 py-5 rounded-full flex-row items-center`}
              onPress={() => {
                // @ts-ignore
                navigation.navigate(SCREEN_NAMES.BLOGS)
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-forward" size={20} color="white" />
              <Text style={tw`text-white font-poppins-bold `}>
                View All Blogs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`mt-6 justify-center  items-center  align-middle  bg-transparent border border-warm w-[90%] px-6 py-5 rounded-full flex-row items-center`}
              onPress={() => {
                // @ts-ignore
                navigation.navigate(SCREEN_NAMES.CREATE_BLOG_POST)
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={25}
                color={tw.color('primary-deep')}
                style={tw`font-bold`}
              />
              <Text style={tw`text-primary-deep font-poppins-bold `}>
                Write a Blog Post
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  )
}

export default Timeline
