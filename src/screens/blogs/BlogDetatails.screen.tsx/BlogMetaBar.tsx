import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import LikeForm from 'components/LikeForm'
import { Blog } from '../../../../types'

interface Props {
  blog: Blog
  content: boolean
  onToggle: () => void
  onLike: (id: string) => Promise<void>
}

const BlogMetaBar: React.FC<Props> = ({ blog, content, onToggle, onLike }) => {
  const formattedDate = blog.publishedAt
    ? formatDate(new Date(blog.publishedAt), 'MMMM dd, yyyy')
    : 'Draft'

  return (
    <View style={tw`p-4`}>
      <View style={tw`flex-row items-center justify-between`}>
        <ProfAvatar user={blog.user} size={40} subtitle={formattedDate} />
        <TouchableOpacity
          style={tw`flex-row items-center align-center justify-center gap-1`}
          onPress={onToggle}
        >
          {content && (
            <Text style={tw`text-primary`}>{blog.amountOfComments ?? 0}</Text>
          )}
          <Ionicons
            name={content ? 'chatbubble-ellipses-outline' : 'book-outline'}
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
          onLike={onLike}
        />
      </View>
    </View>
  )
}

export default BlogMetaBar
