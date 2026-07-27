import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import LikeForm from 'components/LikeForm'
import { colors } from 'components/ui/tokens'
import { Blog } from '../../../../types'
import { getReadingStats } from '../utils/readingStats'

interface Props {
  blog: Blog
  content: boolean
  onToggle: () => void
  onLike: (id: string) => Promise<void>
}

const BlogMetaBar: React.FC<Props> = ({ blog, content, onToggle, onLike }) => {
  const formattedDate = blog.publishedAt
    ? formatDate(new Date(blog.publishedAt), 'MMM d, yyyy')
    : 'Draft'
  const { minutes } = getReadingStats(blog.content)

  return (
    <View style={tw`px-4 py-3 flex-row items-center justify-between`}>
      <View style={tw`flex-1 mr-3`}>
        <ProfAvatar
          user={blog.user}
          size={40}
          subtitle={`${formattedDate}  ·  ${minutes} min read`}
        />
      </View>

      <View style={tw`flex-row items-center gap-2`}>
        <LikeForm
          id={blog.id}
          likersCount={blog.amountOfLikes}
          isReactor={false}
          size={24}
          flexDir="row"
          onLike={onLike}
        />
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.85}
          style={[
            tw`flex-row items-center px-3 py-1.5 rounded-full`,
            { backgroundColor: colors.primarySoft },
          ]}
        >
          <Ionicons
            name={content ? 'chatbubble-ellipses-outline' : 'book-outline'}
            size={16}
            color={colors.primaryDeep}
          />
          <Text
            style={[
              tw`ml-1 text-xs font-poppins-semibold`,
              { color: colors.primaryDeep },
            ]}
          >
            {content ? blog.amountOfComments ?? 0 : 'Read'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default BlogMetaBar
