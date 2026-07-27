import React from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import { FeedStackParams } from '../../../../types'
import useToggle from 'hooks/useToggle'
import Comment from './Comment'
import BlogHero from './BlogHero'
import BlogMetaBar from './BlogMetaBar'
import BlogReadingView from './BlogReadingView'
import {
  useFetchBlogQuery,
  useToggleBlogLikeMutation,
} from 'store/blog-api-slice'

type Props = StackScreenProps<FeedStackParams, 'BlogDetail'>

const BlogDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { blogId } = route.params
  const { data: blog, isLoading, isFetching } = useFetchBlogQuery(blogId)
  const [content, showContent] = useToggle(true)
  const [toggleBlogLike] = useToggleBlogLikeMutation()

  const handleLike = async (id: string) => {
    await toggleBlogLike(id).unwrap()
  }

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
    <Screen safeArea={false} loading={isLoading || isFetching}>
      {content ? (
        <BlogReadingView
          blog={blog}
          content={content}
          onToggle={showContent}
          onLike={handleLike}
          onClose={() => navigation.goBack()}
        />
      ) : (
        <>
          <BlogHero blog={blog} onClose={() => navigation.goBack()} />
          <BlogMetaBar
            blog={blog}
            content={content}
            onToggle={showContent}
            onLike={handleLike}
          />
          <Comment blogId={blogId} />
        </>
      )}
    </Screen>
  )
}

export default BlogDetailScreen
