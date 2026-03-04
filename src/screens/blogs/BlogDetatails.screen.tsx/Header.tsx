import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
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
import { useDeleteBlogMutation } from '../../../store/blog-api-slice'

interface Props {
  blog: Blog
  showContent?: boolean
  onShowContent: () => void
}

const BlogHeader: React.FC<Props> = ({ blog, onShowContent, showContent }) => {
  const formattedDate = formatDate(new Date(blog.publishedAt), 'MMMM dd, yyyy')
  const navigation = useNavigation<NavigationProp<FeedStackParams>>()
  const { userId } = useSelector((state: RootState) => state.auth)
  const isOwner = userId === blog.user.id
  const [menuVisible, toggleMenu] = useToggle(false)
  const [deleteBlog] = useDeleteBlogMutation()

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

  return (
    <View>
      <ImageBackground
        source={{ uri: blog.titlePicture }}
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
            <View style={tw`flex-row flex-wrap mb-3`}>
              {blog.interests?.map((interest) => (
                <View
                  key={interest.id}
                  style={tw`bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full mr-2 mb-2`}
                >
                  <Text
                    style={tw`text-green-700 dark:text-green-300 text-xs font-medium`}
                  >
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
          <TouchableOpacity onPress={() => onShowContent()}>
            <Ionicons
              name={`${showContent ? 'home-outline' : 'car'}`}
              color="red"
            />
          </TouchableOpacity>
          <LikeForm
            id={blog.id}
            amountOfKorems={blog.amountOfLikes}
            isReactor={false}
            koreHeight={28}
            flexDir="row"
          />
        </View>
      </View>
    </View>
  )
}

export default BlogHeader
