import React from 'react'
import { View } from 'react-native'
import { formatDistanceToNow } from 'date-fns'
import { useNavigation } from '@react-navigation/native'

import tw from 'lib/tailwind'
import Text from './Text'
import ProfAvatar from './ProfAvatar'
import nameToPicture from 'lib/nameToPicture'
import { PostProps } from '../../types'
import LikeForm from './LikeForm'
import { useTheme } from 'hooks/useTheme'
import routes from '../navigation/routes'

interface CommentProps {
  comment: PostProps
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { isDarkMode } = useTheme()
  const navigation = useNavigation()

  const handleProfileNavigation = (userId: string | number) => {
    console.log('Navigating to profile for user:', userId)

    // Get the parent navigator to navigate to ACCOUNT tab with profile params
    const parentNavigation = navigation.getParent()
    if (parentNavigation) {
      // @ts-ignore - Navigate to ACCOUNT tab and then to PROFILE with profileId
      parentNavigation.navigate(routes.ACCOUNT, {
        screen: routes.PROFILE,
        params: { profileId: userId.toString() },
      })
    } else {
      // Fallback: try direct navigation
      // @ts-ignore
      navigation.navigate(routes.ACCOUNT, {
        screen: routes.PROFILE,
        params: { profileId: userId.toString() },
      })
    }
  }

  return (
    <View style={tw`p-4 border-b border-gray-${isDarkMode ? '700' : '100'}`}>
      <ProfAvatar
        size={20}
        user={comment.user!}
        subtitle={comment.postText}
        subtitleParams={{
          maxLength: 150,
        }}
      />
      <View style={tw`flex-1 flex-row justify-between ml-3`}>
        <View style={tw`items-center mt-2`}>
          <Text style={tw`ml-1 font-thin text-xs pl-2`}>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </Text>
        </View>
        <LikeForm
          id={comment.id.toString()}
          isReactor={!!comment.isReactor}
          amountOfKorems={comment.amountOfKorems}
          koreHeight={16}
          flexDir="row"
        />
      </View>
    </View>
  )
}

export default Comment
