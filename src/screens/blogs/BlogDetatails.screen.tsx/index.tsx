import React from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import { FeedStackParams } from '../../../../types'
// import Header from './Header'
import CoverHero from '../CreateBlog.screen/BlogContent/CoverHero'
import Body from './Body'
import useToggle from 'hooks/useToggle'
import Comment from './Comment'
import { useFetchBlogQuery } from 'store/blog-api-slice'
import HeroActionBar from './HeroActionBar'
import BlogMetaBar from './BlogMetaBar'
import { useToggleBlogLikeMutation } from '../../../store/blog-api-slice'

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
      <CoverHero
        coverImage={blog.titlePicture}
        interests={blog.interests || []}
        headerComponent={
          <HeroActionBar
            onClose={() => navigation.goBack()}
            onMenu={() => {}}
            isDraft={false}
          />
        }
        titleComponent={
          <Text
            style={tw`text-3xl font-syne-bold text-white`}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {blog.title}
          </Text>
        }
      />
      <BlogMetaBar
        blog={blog}
        content={content}
        onToggle={showContent}
        onLike={handleLike}
      />
      {content ? <Body blog={blog} /> : <Comment blogId={blogId} />}
    </Screen>
  )
}

export default BlogDetailScreen
