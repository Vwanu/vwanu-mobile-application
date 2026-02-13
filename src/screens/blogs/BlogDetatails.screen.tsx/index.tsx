import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import { FeedStackParams } from '../../../../types'
import { mockBlogs } from 'data/mockBlogs'
import Header from './Header'
import Body from './Body'
import useToggle from 'hooks/useToggle'
import Comment from './Comment'

type Props = StackScreenProps<FeedStackParams, 'BlogDetail'>

const BlogDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { blogId } = route.params
  const blog = mockBlogs.find((b) => b.id === blogId)
  const [content, showContent] = useToggle(true)

  if (!blog) {
    return (
      <Screen>
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-500`}>Blog not found</Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen safeArea={false}>
      <Header
        blog={blog}
        showContent={content}
        onShowContent={() => {
          showContent()
        }}
      />
      {content ? <Body blog={blog} /> : <Comment blogId={blogId} />}
    </Screen>
  )
}

export default BlogDetailScreen
