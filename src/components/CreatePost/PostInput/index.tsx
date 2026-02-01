import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar } from 'react-native-paper'
import { View, Platform } from 'react-native'
import { Input } from '@ui-kitten/components'

import tw from 'lib/tailwind'
import Img from 'assets/svg/Image'
import useToggle from 'hooks/useToggle'
import PostInputModal from '../PostInputModal'
import { useFetchProfileQuery } from 'store/profiles'
import { RootState } from 'store'
import { useTheme } from 'hooks/useTheme'

const shadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
}

interface PostInputProps {
  communityId?: string
  canCreatePost?: boolean
}

const PostInput: React.FC<PostInputProps> = ({
  communityId,
  canCreatePost = true,
}) => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: user } = useFetchProfileQuery(userId!)
  const { isDarkMode } = useTheme()
  const [creatingPost, toggleCreatingPost] = useToggle(false)
  const [openBottomSheet] = useToggle(false)

  const handlePress = () => {
    if (canCreatePost) {
      toggleCreatingPost()
    }
  }

  return (
    <View style={[tw`px-1 ${!canCreatePost ? 'opacity-50' : ''}`, shadowStyle]}>
      <View style={tw`flex flex-row my-2`}>
        <Avatar.Image
          source={{
            uri:
              (user?.profilePicture as any)?.original ||
              `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`,
          }}
          size={50}
        />
        <View style={tw`flex-1 ml-2`}>
          <Input
            editable={false}
            autoFocus
            placeholder={
              canCreatePost
                ? "What's on your mind?"
                : 'Join this community to create posts'
            }
            onPressIn={handlePress}
            style={tw`border-[${
              isDarkMode ? 'white' : (tw.color('text-primary') as string)
            }] border-[1px] ${
              canCreatePost ? 'bg-white' : 'bg-gray-100'
            } rounded-2xl mb-0`}
            accessoryRight={canCreatePost ? <Img /> : undefined}
            disabled
          />
        </View>
      </View>
      <PostInputModal
        visible={creatingPost}
        onClose={() => toggleCreatingPost()}
        openBottomSheet={openBottomSheet}
        communityId={communityId}
      />
    </View>
  )
}

export default PostInput
