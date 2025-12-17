import React, { useCallback, useMemo } from 'react'
import Post from 'components/Post'
import { View } from 'react-native'
import tw from 'lib/tailwind'
import NoPost from 'components/EmptyList'
import Separator from 'components/Separator'
import { useFetchPostsQuery } from 'store/post'
import TimelineSkeletone from './TimelineSkeletone'
import PaginatedList, { PaginationParams } from 'components/PaginatedList'

interface Props {
  communityId?: string
}

const PostList: React.FC<Props> = ({ communityId }) => {
  const initialQueryParams = useMemo(
    () => ({
      $limit: 10,
      $skip: 0,
      $sort: { createdAt: -1 } as const,
      communityId: communityId || undefined,
    }),
    []
  )

  const posts = useFetchPostsQuery(initialQueryParams)

  // Force re-render when posts data changes by creating a dependency on posts.data
  const currentPosts = useMemo(() => {
    return posts.data?.data || []
  }, [posts.data?.data])

  const fetchPosts = useCallback(
    async ({ limit, skip }: PaginationParams) => {
      // console.log('fetchPosts called with:', { limit, skip })
      try {
        // Create a new query with updated pagination parameters
        const queryParams = {
          $limit: limit,
          $skip: skip,
          $sort: { createdAt: -1 } as const,
        }

        // Note: We can't easily fetch with new params using the existing hook
        // For now, just return the current data to prevent duplicates
        // This should be refactored to use a proper pagination approach

        if (!posts.data) {
          return { data: [], total: 0 }
        }

        // For load more, return empty array to prevent duplicates
        // The real solution would be to implement proper server-side pagination
        if (skip > 0) {
          // console.log(
          //   'Load more requested, returning empty to prevent duplicates'
          // )
          return { data: [], total: posts.data.data.length }
        }

        return {
          data: posts.data.data,
          total: posts.data.data.length,
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        return { data: [], total: 0 }
      }
    },
    [posts.data]
  )

  const shouldShowLoading = posts.isLoading && !posts.data

  if (shouldShowLoading) {
    return <TimelineSkeletone />
  }

  return (
    <PaginatedList
      key={`posts-${currentPosts.length}-${currentPosts
        .map((p) => `${p.id}-${p.amountOfKorems}-${p.isReactor}`)
        .join('-')}`}
      initialData={{ data: currentPosts, total: 100 }}
      initialLimit={10}
      fetchData={fetchPosts}
      isFetching={posts.isFetching || posts.isLoading}
      contentContainerStyle={tw`pb-34`}
      ItemSeparatorComponent={() => <Separator style="h-1" />}
      showsVerticalScrollIndicator={false}
      keyExtractor={({ id }) => `post-${id.toString()}`}
      renderItem={(post) => <Post {...post.item} toggleCommenting={() => {}} />}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      initialNumToRender={5}
      windowSize={5}
      updateCellsBatchingPeriod={100}
      ListEmptyComponent={
        <View style={tw`mt-20`}>
          <NoPost
            title="No posts Yet"
            subtitle="Hurry be the first to create a post"
          />
        </View>
      }
    />
  )
}

export default PostList
