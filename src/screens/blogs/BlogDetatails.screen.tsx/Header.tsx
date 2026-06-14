import React from 'react'
import { View, TouchableOpacity, Alert, Dimensions } from 'react-native'
import { ImageBackground } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { Popover } from '@ui-kitten/components'
import { formatDate } from 'date-fns'
import { Blog, FeedStackParams } from '../../../../types'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Button from 'components/Button'

import ProfAvatar from 'components/ProfAvatar'
import LikeForm from 'components/LikeForm'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootState } from '../../../store'
import useToggle from 'hooks/useToggle'
import {
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useToggleBlogLikeMutation,
} from '../../../store/blog-api-slice'
import { cdnImageUrl } from 'lib/cdnImageUrl'

interface Props {
  blog: Blog
  showContent?: boolean
  onShowContent: () => void
}

const BlogHeader: React.FC<Props> = ({ blog, onShowContent, showContent }) => {
  const screenWidth = Dimensions.get('window').width
  const [toggleBlogLike] = useToggleBlogLikeMutation()
  const handleLike = async (id: string) => {
    await toggleBlogLike(id).unwrap()
  }
  const formattedDate = blog.publishedAt
    ? formatDate(new Date(blog.publishedAt), 'MMMM dd, yyyy')
    : 'Draft'
  const navigation = useNavigation<NavigationProp<FeedStackParams>>()
  const { userId } = useSelector((state: RootState) => state.auth)
  const isOwner = userId === blog.user.id
  const [menuVisible, toggleMenu] = useToggle(false)
  const [deleteBlog] = useDeleteBlogMutation()
  const [updateBlog] = useUpdateBlogMutation()
  const isPublished = !!blog.publishedAt

  const handleDelete = () => {
    toggleMenu()
    Alert.alert('Delete Blog', 'Are you sure you want to delete this blog?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBlog(blog.id).unwrap()
            navigation.goBack()
          } catch (error) {
            Alert.alert('Error', 'Failed to delete blog. Please try again.')
          }
        },
      },
    ])
  }

  const handleEdit = () => {
    toggleMenu()
    navigation.navigate('CreateBlog', { blogId: blog.id })
  }

  const handleToggleDraft = () => {
    toggleMenu()
    const action = isPublished ? 'unpublish' : 'publish'
    Alert.alert(
      isPublished ? 'Set as Draft' : 'Publish Blog',
      isPublished
        ? 'This blog will be unpublished and saved as a draft.'
        : 'This blog will be published and visible to everyone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isPublished ? 'Set as Draft' : 'Publish',
          onPress: async () => {
            try {
              await updateBlog({
                id: blog.id,
                publishedAt: isPublished ? null : new Date().toISOString(),
              }).unwrap()
            } catch (error) {
              Alert.alert(
                'Error',
                `Failed to ${action} blog. Please try again.`
              )
            }
          },
        },
      ]
    )
  }

  return (
    <View>
      <ImageBackground
        source={cdnImageUrl(blog.titlePicture, {
          width: screenWidth,
          height: 350,
        })}
        style={tw`w-full h-[350px] rounded-b-3xl overflow-hidden`}
        contentFit="cover"
      >
        <View style={tw`w-full bg-gray-500 h-full z-10 absolute opacity-25`} />
        <SafeAreaView
          style={tw`flex-1 flex-col justify-between align-between z-50`}
        >
          <View style={tw`flex-row items-center justify-between px-2`}>
            {/* Back Button */}
            <TouchableOpacity
              style={tw`w-10 h-10 bg-black/50 rounded-full p-2`}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            {/* Owner Menu */}
            {isOwner && (
              <Popover
                visible={menuVisible}
                anchor={() => (
                  <TouchableOpacity
                    style={tw`w-10 h-10 bg-black/50 rounded-full p-2`}
                    onPress={toggleMenu}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
                onBackdropPress={toggleMenu}
                backdropStyle={tw`bg-black/2`}
              >
                <View style={tw`flex-col items-start rounded-md p-2`}>
                  <Button
                    title="Edit"
                    accessoryLeft={<Ionicons name="create-outline" size={18} />}
                    appearance="ghost"
                    onPress={handleEdit}
                  />
                  <Button
                    title={isPublished ? 'Set as Draft' : 'Publish'}
                    accessoryLeft={
                      <Ionicons
                        name={isPublished ? 'document-outline' : 'send-outline'}
                        size={18}
                      />
                    }
                    appearance="ghost"
                    onPress={handleToggleDraft}
                  />
                  <Button
                    title="Delete"
                    accessoryLeft={
                      <Ionicons name="trash-outline" size={18} color="red" />
                    }
                    appearance="ghost"
                    style={tw`text-red-500`}
                    onPress={handleDelete}
                  />
                </View>
              </Popover>
            )}
          </View>
          <View>
            <View style={tw`flex-row flex-wrap mb-3 px-2`}>
              {blog.interests?.map((interest) => (
                <View
                  key={interest.id}
                  style={tw`bg-black opacity-70 px-3 py-1 rounded-md mr-2 mb-2`}
                >
                  <Text style={tw`text-white text-md font-bold`}>
                    {interest.name}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={tw`text-2xl px-2 font-bold font-bold text-white`}>
              {blog.title}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-center justify-between `}>
          <ProfAvatar user={blog.user} size={40} subtitle={formattedDate} />
          <TouchableOpacity
            style={tw`flex-row items-center align-center justify-center gap-1`}
            onPress={() => onShowContent()}
          >
            {showContent && (
              <Text style={tw`text-primary `}>
                {blog.amountOfComments ?? 0}
              </Text>
            )}
            <Ionicons
              name={`${
                showContent ? 'chatbubble-ellipses-outline' : 'book-outline'
              }`}
              color={tw.color('primary')}
              size={20}
            />
          </TouchableOpacity>
          <LikeForm
            id={blog.id}
            likersCount={blog.amountOfLikes}
            isReactor={false}
            size={28}
            flexDir="row"
            onLike={handleLike}
          />
        </View>
      </View>
    </View>
  )
}

export default BlogHeader
