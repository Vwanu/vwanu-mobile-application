import React from 'react'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { MockBlog } from 'data/mockBlogs'
import ProfAvatar from 'components/ProfAvatar'

interface BlogCardFeaturedProps {
  blog: MockBlog
  onPress?: () => void
  width?: number
  height?: number
}

const BlogCardFeatured: React.FC<BlogCardFeaturedProps> = ({
  blog,
  onPress,
  width = 222,
  height = 260,
}) => {
  return (
    <TouchableOpacity
      style={[{ width, height }, tw`mr-4 rounded-xl`]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: blog.titlePicture }}
        style={tw`w-full h-full`}
        imageStyle={tw`rounded-xl`}
      >
        {/* Dark overlay for better text readability */}
        <View
          style={tw`absolute inset-0 bg-black/40 rounded-xl justify-between p-4`}
        >
          <View style={tw`flex-row items-center`} />

          {/* Bottom: Title and interests */}
          <View>
            <View style={tw`flex-row flex-wrap mb-2`}>
              {blog.interests?.slice(0, 2).map((interest) => (
                <View
                  key={interest.id}
                  style={tw`bg-white/50 px-2 py-1 rounded-full mr-2`}
                >
                  <Text style={tw`text-white font-semibold text-xs`}>
                    {interest.name}
                  </Text>
                </View>
              ))}
            </View>
            <Text
              style={tw`text-white font-bold text-base mb-4`}
              numberOfLines={2}
            >
              {blog.title}
            </Text>
            <ProfAvatar
              user={blog.author}
              size={36}
              subtitle={formatDate(blog.createdAt, 'PPP')}
              titleStyles={tw`text-white font-semibold text-sm`}
              subtitleParams={{ textStyles: tw`text-white font-bold text-xs` }}
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default BlogCardFeatured
