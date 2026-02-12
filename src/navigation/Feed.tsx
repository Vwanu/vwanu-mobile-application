/**
 * Feed Stack Navigator
 * Handles timeline, gallery, and post-related screens
 */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// Configuration
import { stackConfig, screenConfigs } from './config/navigationConfig'
import { SCREEN_NAMES } from './utils/navigationUtils'

// Screens
import TimelineScreen from '../screens/timeline/Timeline.screen'
import ImageGallery from '../screens/timeline/ImageGallery.screen'
import SinglePostScreen from '../screens/timeline/SinglePost.screen'
import BlogListScreen from '../screens/blogs/BlogList.screen'

// Types
import { FeedStackParams } from '../../types'

const Stack = createStackNavigator<FeedStackParams>()

/**
 * Feed navigation stack
 * Provides navigation between timeline, gallery, and post details
 */
const FeedNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={stackConfig}
    initialRouteName={SCREEN_NAMES.TIMELINE}
  >
    <Stack.Screen
      name={SCREEN_NAMES.TIMELINE}
      component={TimelineScreen}
      options={{
        ...screenConfigs.timeline,
        title: 'Timeline', // Better accessibility
      }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.GALLERY}
      component={ImageGallery}
      options={{
        ...screenConfigs.gallery,
        title: 'Image Gallery',
      }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.SINGLE_POST}
      component={SinglePostScreen}
      options={{
        ...screenConfigs.singlePost,
        title: 'Post Details',
      }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.BLOGS}
      component={BlogListScreen}
      options={{
        title: 'Blogs',
      }}
    />
  </Stack.Navigator>
)

export default FeedNavigator
