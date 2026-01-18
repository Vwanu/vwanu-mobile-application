/*
Sub-Component: PostHeader
   - Displays profile avatar and privacy settings,
     as well as a popover for deleting the post.
*/

import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Popover, Layout } from '@ui-kitten/components'
import { formatDistanceToNow } from 'date-fns'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import Text from './Text'
import tw from '../lib/tailwind'
import ProfAvatar from './ProfAvatar'
import PrivacyNotice from './PrivacyNotice'
import { PostProps, UpdatePost, ProfileStackParams } from '../../types'
import { RootState } from '../store'
import nameToPicture from 'lib/nameToPicture'
import { useTheme } from 'hooks/useTheme'
import routes from '../navigation/routes'

interface PostHeaderProps extends PostProps {
  onDeletePress: () => void
  deletingVisible: boolean
  toggleDeleting: () => void
  updatePostMeta: { isLoading: boolean }
  updatePost: (data: UpdatePost) => void
  disableNavigation?: boolean
}

const PostHeader: React.FC<PostHeaderProps> = (props) => {
  const user = useSelector((state: RootState) => state.auth)
  const PostUser = props.user
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()
  const { isDarkMode } = useTheme()

  const handleProfileNavigation = (userId: string | number) => {
    // Navigate to the user's profile
    console.log('Navigating to profile for user:', userId)

    // Get the parent navigator (bottom tabs) to navigate to ACCOUNT tab with profile params
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
    <View style={tw`flex flex-row justify-between items-center mb-2`}>
      <View style={tw`flex flex-row items-center mb-2`}>
        <ProfAvatar
          user={PostUser!}
          subtitle={formatDistanceToNow(
            new Date(props.createdAt || Date.now()),
            {
              addSuffix: true,
            }
          )}
          subtitleParams={{
            textStyles: 'text-white font-thin',
          }}
        />
        <PrivacyNotice
          privacyType={props.privacyType}
          canEdit={user.userId === props.user?.id}
          isEditing={props.updatePostMeta.isLoading}
          onEdit={async (newPrivacyType) => {
            try {
              await props.updatePost({
                id: props.id,
                data: { privacyType: newPrivacyType },
              })
            } catch (error) {
              console.error('Failed to update post privacy type', error)
            }
          }}
          style={`mt-5.2 ml-1`}
        />
      </View>
      {props.canDelete && (
        <Popover
          visible={props.deletingVisible}
          anchor={() => (
            <TouchableOpacity onPress={props.toggleDeleting}>
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={15}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          )}
          onBackdropPress={props.toggleDeleting}
          backdropStyle={tw`bg-black/2`}
        >
          <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5`}>
            <TouchableOpacity
              onPress={props.onDeletePress}
              style={tw`flex flex-row items-center`}
            >
              <Ionicons
                name="trash-outline"
                size={15}
                color={isDarkMode ? 'white' : 'black'}
              />
              <Text style={tw`text-sm font-thin`}>Delete Post</Text>
            </TouchableOpacity>
          </View>
        </Popover>
      )}
    </View>
  )
}

export default PostHeader
