import React, { memo, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View } from 'react-native'

import tw from '../lib/tailwind'
import ImageGrid from './ImageGrid'
import AvatarGroup from './AvatarGroups'
import useToggle from '../hooks/useToggle'
import { useDeletePostMutation, useUpdatePostMutation } from '../store/post'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import { PostProps } from '../../types'
import LongText from './LongText'
import { useTheme } from '../hooks/useTheme'

//TO DELETE const { height } = Dimensions.get('screen')

interface Props extends PostProps {
  showViewComment?: boolean
  disableNavigation?: boolean
  toggleCommenting: () => void
}
const Post: React.FC<Props> = ({
  showViewComment = true,
  toggleCommenting,
  ...props
}) => {
  const navigation = useNavigation()
  const [modifying, toggleModifying] = useToggle(false)
  const [seeLikers, toggleLikerPopover] = useToggle(false)
  const [updatePost, updatePostMeta] = useUpdatePostMutation()
  const [deletePost, deletePostMeta] = useDeletePostMutation()
  const { isDarkMode } = useTheme()

  const handleDeletePress = useCallback(() => {
    deletePost(props.id)
    toggleModifying()
  }, [deletePost, props.id, toggleModifying])

  const handleImageTouch = useCallback(
    (id: number) => {
      const index = props.media?.findIndex(
        (media) => media?.id.toString() === id.toString()
      )
      //@ts-ignore
      navigation.navigate('Gallery', { ...props, initialSlide: index })
    },
    [navigation, props]
  )
  const handlePress = () => {
    // console.log('props', props)
    if (!props.disableNavigation) {
      // @ts-ignore
      navigation.navigate('SinglePost', { postId: props.id })
    }
  }
  return (
    <View style={tw`static my-3`}>
      <PostHeader
        {...props}
        updatePostMeta={updatePostMeta}
        onDeletePress={handleDeletePress}
        toggleDeleting={toggleModifying}
        deletingVisible={modifying}
        updatePost={updatePost}
      />

      {props.postText && (
        <TouchableOpacity onPress={handlePress}>
          <LongText text={props.postText} />
        </TouchableOpacity>
      )}

      {props?.media && props.media.length > 0 && (
        <ImageGrid
          medias={props.media}
          style={tw`my-2`}
          onImageTouch={handleImageTouch}
        />
      )}

      <AvatarGroup avatars={props.reactors || []} style={tw`mt-2`} />

      <PostFooter
        {...props}
        toggleCommenting={toggleCommenting}
        toggleLikerPopover={toggleLikerPopover}
        seeLikers={seeLikers}
        showViewComment={showViewComment}
      />
    </View>
  )
}

// Memoize with custom comparison
const MemoizedPost = memo(Post, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.amountOfKorems === nextProps.amountOfKorems &&
    prevProps.amountOfComments === nextProps.amountOfComments &&
    prevProps.isReactor === nextProps.isReactor &&
    prevProps.postText === nextProps.postText &&
    prevProps.media?.length === nextProps.media?.length &&
    prevProps.createdAt === nextProps.createdAt
  )
})

MemoizedPost.displayName = 'Post'

export default MemoizedPost
