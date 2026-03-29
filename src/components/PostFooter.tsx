/*
========================================================
   Sub-Component: PostFooter
   - Renders like info, share, and comment buttons.
======================================================== */

import React, { memo, useCallback, useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View } from 'react-native'

import Text from './Text'
import tw from '../lib/tailwind'
import { PostProps } from '../../types'
import LikerPopover from './LikersPopOver'
import { abbreviateNumber } from '../lib/numberFormat'
import LikeForm from './LikeForm'
import { useTheme } from '../hooks/useTheme'
import {
  useToggleKoreMutation,
  useFetchLikesQuery,
  useLazyFetchPostLikersQuery,
} from 'store/post'

interface Props extends PostProps {
  showViewComment?: boolean
}

interface PostFooterProps extends Props {
  toggleCommenting: () => void
  toggleLikerPopover: () => void
  seeLikers: boolean
  showViewComment?: boolean
  disableNavigation?: boolean
}

const PostFooter: React.FC<PostFooterProps> = (props) => {
  const navigation = useNavigation()
  const [toggleKore] = useToggleKoreMutation()

  const [fetchLikers, { isFetching: isFetchingLikers, data: likersData }] =
    useLazyFetchPostLikersQuery()

  const handleShowLikers = useCallback(() => {
    props.toggleLikerPopover()
    fetchLikers({ postId: props.id.toString() })
  }, [props.toggleLikerPopover, fetchLikers, props.id])

  const handleLike = useCallback(
    async (id: string) => {
      await toggleKore(id).unwrap()
    },
    [toggleKore]
  )

  const moreReactors = props.isReactor
    ? (props.amountOfKorems ?? 0) - 1
    : (props.amountOfKorems ?? 0) - (props.reactors?.length - 2 || 0)
  const { isDarkMode } = useTheme()
  const handleCommentPress = useCallback(() => {
    if (props.disableNavigation) {
      // We're in SinglePost view, just toggle the comment form
      props.toggleCommenting()
    } else {
      // Navigate to SinglePost with comment form open
      // @ts-ignore
      navigation.navigate('SinglePost', {
        postId: props.id,
        isCommenting: true,
      })
    }
  }, [props.disableNavigation, props.toggleCommenting, props.id, navigation])

  const textColor = isDarkMode ? 'text-white' : 'text-black'

  const anchorElement = useMemo(
    () => (
      <TouchableOpacity onPress={handleShowLikers}>
        <View style={tw`flex flex-row items-center`}>
          <Text style={tw`text-sm font-thin`}>Liked by</Text>
          {!!props.isReactor && (
            <Text style={tw`text-primary text-sm`}> You</Text>
          )}
          {props.isReactor ? (
            <Text style={tw`${textColor}`}>
              {' '}
              {props.reactors && props.reactors[0]?.firstName}
            </Text>
          ) : (
            <Text style={tw`${textColor}`}>
              {' '}
              {props.reactors &&
                props.reactors.map((u: any) => u.firstName).join(', ')}
            </Text>
          )}
          {moreReactors > 0 && (
            <>
              {props.isReactor && (
                <Text style={tw`${textColor} font-thin`}> and</Text>
              )}
              <Text style={tw`${textColor}`}>
                {' '}
                {abbreviateNumber(moreReactors)}
                {props.isReactor
                  ? moreReactors > 1
                    ? ' others'
                    : ' more'
                  : ''}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleShowLikers, props.isReactor, props.reactors, moreReactors, textColor]
  )

  return (
    <View style={tw`flex flex-1 flex-row items-center justify-between`}>
      <View>
        {props.amountOfKorems ? (
          <LikerPopover
            visible={props.seeLikers}
            likers={likersData?.data || []}
            isFetching={isFetchingLikers}
            onDismiss={props.toggleLikerPopover}
            onRefetch={() => fetchLikers({ postId: props.id.toString() })}
            anchorContent={anchorElement}
          />
        ) : (
          <Text style={tw`${textColor} text-sm italic font-thin`}>
            Be the first to react
          </Text>
        )}
        {props.showViewComment && (props.amountOfComments ?? 0) > 0 && (
          <TouchableOpacity onPress={handleCommentPress}>
            <Text
              style={tw`${isDarkMode ? 'text-white' : 'text-primary'} text-sm`}
            >
              {props.amountOfComments === 1 ? 'View' : 'View all'}
              <>
                {props.amountOfComments > 1 && (
                  <Text
                    style={tw`${
                      isDarkMode ? 'text-white' : 'text-primary'
                    } text-sm`}
                  >
                    {' '}
                    {abbreviateNumber(props.amountOfComments || 0)}
                  </Text>
                )}
              </>
              <Text
                style={tw`${
                  isDarkMode ? 'text-white' : 'text-primary'
                } text-sm`}
              >
                {' '}
                {props.amountOfComments === 1 ? 'comment' : 'comments'}
              </Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={tw`flex flex-row items-center justify-between`}>
        <View style={tw`self-end flex-row items-center`}>
          <Ionicons
            name="share-outline"
            size={15}
            color={isDarkMode ? 'white' : 'black'}
          />
        </View>
        <View style={tw`mx-2 items-center`}>
          <LikeForm
            id={props.id.toString()}
            isReactor={!!props.isReactor}
            likersCount={+props.amountOfKorems}
            size={18}
            flexDir="column"
            onLike={handleLike}
            onToggleLikers={handleShowLikers}
          />
        </View>
        <View style={tw`items-center`}>
          <Text
            category="c1"
            appearance="hint"
            style={tw`${
              isDarkMode ? 'text-white' : 'text-black'
            } text-sm font-thin`}
          >
            {abbreviateNumber(props.amountOfComments || 0)}
          </Text>
          <TouchableOpacity onPress={handleCommentPress}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={15}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

// Memoize PostFooter with custom comparison
const MemoizedPostFooter = memo(PostFooter, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.amountOfKorems === nextProps.amountOfKorems &&
    prevProps.amountOfComments === nextProps.amountOfComments &&
    prevProps.isReactor === nextProps.isReactor &&
    prevProps.seeLikers === nextProps.seeLikers &&
    prevProps.showViewComment === nextProps.showViewComment &&
    prevProps.reactors?.length === nextProps.reactors?.length
  )
})

MemoizedPostFooter.displayName = 'PostFooter'

export default MemoizedPostFooter
