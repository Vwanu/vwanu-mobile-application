/**
 * Posts Tab Component
 * Displays user's posts with empty state
 */
import React from 'react'
import { View, FlatList } from 'react-native'

// Components
import Text from '../../../components/Text'
import Post from '../../../components/Post'
import NoPost from '../../../components/EmptyList'

// Hooks and utilities
import tw from '../../../lib/tailwind'
import { useFetchPostsQuery } from '../../../store/post'
import routes from '../../../navigation/routes'

// Types
import { TabContentProps } from '../types'

const Separator = () => <View style={tw`m-1`} />

const PostsTab: React.FC<TabContentProps> = ({
  targetUserId,
  userId,
  user,
  navigation,
}) => {
  const { data: posts = [] } = useFetchPostsQuery(
    targetUserId
      ? {
          userId: targetUserId,
          $sort: { createdAt: -1 },
        }
      : undefined
  )

  return (
    <FlatList
      ListEmptyComponent={() => (
        <View style={tw`mt-4`}>
          <NoPost
            title={
              userId === user?.id
                ? 'No posts Yet'
                : 'They have not created a post yet '
            }
            subtitle={
              userId === user?.id
                ? 'Hurry be the first to create a post'
                : 'Encourage them to post on vwanu'
            }
            actionBtn={{
              label: 'Create Post',
              onPress: () => {
                navigation.navigate(routes.TIMELINE)
              },
            }}
          />
        </View>
      )}
      data={(posts as any)?.data || []}
      renderItem={(post) => <Post {...post.item} />}
      ItemSeparatorComponent={Separator}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default PostsTab
