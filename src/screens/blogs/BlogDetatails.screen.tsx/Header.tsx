import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { ImageBackground } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'

import ProfAvatar from 'components/ProfAvatar'
import LikeForm from 'components/LikeForm'

import { mockBlogs } from 'data/mockBlogs'

interface Props {
  blog: (typeof mockBlogs)[0]
  showContent?: boolean
  onShowContent: () => void
}

const BlogHeader: React.FC<Props> = ({ blog, onShowContent, showContent }) => {
  const formattedDate = formatDate(new Date(blog.publishedAt), 'MMMM dd, yyyy')

  return (
    <View>
      <ImageBackground
        source={{ uri: blog.titlePicture }}
        style={tw`w-full h-[350px] rounded-b-3xl overflow-hidden`}
        contentFit="cover"
      >
        <View style={tw`flex flex-col justify-between align-between`}>
          {/* Back Button */}
          <TouchableOpacity
            style={tw` left-4 bg-black/40 rounded-full p-2`}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={tw` absolute -bottom-80 `}>
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
            <Text
              style={tw`text-2xl px-3 font-bold  font-bold text-gray-900 dark:text-white mb-4`}
            >
              {blog.title}
            </Text>
          </View>
        </View>
      </ImageBackground>
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-center justify-between mb-6 pb-4 `}>
          <ProfAvatar user={blog.author} size={40} subtitle={formattedDate} />
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
