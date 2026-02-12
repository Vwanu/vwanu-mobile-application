import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import LikeForm from 'components/LikeForm'
import { MockBlog } from 'data/mockBlogs'

interface BlogCardProps {
  blog: MockBlog
  onPress?: () => void
}

// Truncate text at word boundary (don't cut words in half)
const truncateAtWord = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text

  // Find the last space before maxLength
  const truncated = text.slice(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex === -1) {
    // No space found, return empty or first word if it fits
    return ''
  }

  // Remove trailing comma/space if present
  let result = truncated.slice(0, lastSpaceIndex)
  result = result.replace(/,\s*$/, '')

  return result
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress }) => {
  const { width: screenWidth } = useWindowDimensions()
  const formattedDate = formatDate(new Date(blog.publishedAt), 'MMM dd, yyyy')

  // Calculate max characters based on available width
  // Available width = screen - image(100) - margins(12+24) - padding(12)
  const availableWidth = screenWidth - 100 - 12 - 24 - 12
  const avgCharWidth = 7 // approximate character width in pixels
  const maxInterestLength = Math.floor(availableWidth / avgCharWidth)

  return (
    <TouchableOpacity
      style={[tw`mb-4 rounded-md`, shadowStyle]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={tw`bg-white dark:bg-gray-800 rounded-xl overflow-hidden`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-[100px] h-[100px] p-2`}>
            <Image
              source={{ uri: blog.titlePicture }}
              style={tw`w-full h-[100%] rounded-lg`}
            />
          </View>
          <View style={tw`ml-3 flex-1 justify-between py-2`}>
            <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>
              {truncateAtWord(
                blog.interests?.map((interest) => interest?.name).join(', ') ||
                  '',
                maxInterestLength
              )}
            </Text>
            <Text style={tw`font-semibold text-gray-900 dark:text-white`}>
              {blog.title}
            </Text>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>
                {formattedDate}
              </Text>

              <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>
                by {blog.author.firstName} {blog.author.lastName}
              </Text>

              <LikeForm
                id={blog.id}
                amountOfKorems={blog.amountOfLikes}
                isReactor={false}
                koreHeight={24}
                flexDir="row"
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const shadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
}
export default BlogCard
