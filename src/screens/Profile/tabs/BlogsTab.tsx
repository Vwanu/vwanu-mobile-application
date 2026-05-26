import React from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '@ui-kitten/components'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { TabContentProps } from '../types'

/**
 * Blogs Tab Component
 * Displays list of blog posts authored by the user
 */
const BlogsTab: React.FC<TabContentProps> = ({ targetUserId, navigation }) => {
  // Mock data - in a real app, this would come from an API
  const mockBlogs = [
    {
      id: 1,
      title: 'My Journey into Mobile Development',
      excerpt:
        'How I transitioned from web development to creating mobile applications with React Native...',
      readTime: '5 min read',
      publishedAt: '2024-01-15',
      tags: ['Science & Technology', 'Career & Education'],
      views: 1250,
      likes: 45,
    },
    {
      id: 2,
      title: 'Building Better User Interfaces',
      excerpt:
        'Best practices for creating intuitive and accessible user interfaces that users love...',
      readTime: '8 min read',
      publishedAt: '2024-01-10',
      tags: ['Arts & Entertainment', 'Science & Technology'],
      views: 890,
      likes: 32,
    },
    {
      id: 3,
      title: 'The Future of Social Media',
      excerpt:
        'Exploring emerging trends and technologies that will shape the next generation of social platforms...',
      readTime: '12 min read',
      publishedAt: '2024-01-05',
      tags: ['Society & Culture', 'Science & Technology'],
      views: 2100,
      likes: 78,
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const renderBlogItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={tw`bg-warm-surface border border-warm-border rounded-card p-3 mb-3`}
      onPress={() => {
        // TODO: Navigate to blog post detail
        console.log('Navigate to blog post:', item.id)
      }}
    >
      {/* Interest tags */}
      <View style={tw`flex-row flex-wrap mb-2`}>
        {item.tags.map((tag: string, index: number) => (
          <View
            key={index}
            style={tw`bg-primary-soft px-2.5 py-1 rounded-full mr-2 mb-1`}
          >
            <Text style={tw`text-primary-deep text-xs font-poppins-semibold`}>
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <Text style={tw`font-syne-bold text-lg text-ink mb-1`}>{item.title}</Text>
      <Text
        style={tw`text-soft font-poppins text-sm leading-5 mb-3`}
        numberOfLines={2}
      >
        {item.excerpt}
      </Text>

      {/* Meta information */}
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-mute font-poppins text-xs mr-3`}>
            {formatDate(item.publishedAt)}
          </Text>
          <Text style={tw`text-mute font-poppins text-xs`}>
            {item.readTime}
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-row items-center mr-3`}>
            <Ionicons name="eye-outline" size={14} color={tw.color('mute')} />
            <Text style={tw`text-mute font-poppins text-xs ml-1`}>
              {item.views.toLocaleString()}
            </Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="heart-outline" size={14} color={tw.color('mute')} />
            <Text style={tw`text-mute font-poppins text-xs ml-1`}>
              {item.likes}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={tw`flex-1  pt-3`}>
      {mockBlogs.length > 0 ? (
        <FlatList
          data={mockBlogs}
          renderItem={renderBlogItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-4`}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center px-8 pt-24`}>
          <View
            style={tw`w-16 h-16 rounded-full bg-warm-surface border border-warm-border items-center justify-center mb-4`}
          >
            <Ionicons
              name="library-outline"
              size={28}
              color={tw.color('mute')}
            />
          </View>
          <Text style={tw`text-base font-syne-bold text-ink text-center`}>
            No blog posts yet
          </Text>
          <Text
            style={tw`text-sm font-poppins text-mute mt-1 text-center leading-5`}
          >
            Start writing and share your thoughts with the world
          </Text>
          <Button
            style={tw`mt-4`}
            appearance="filled"
            status="primary"
            onPress={() => {
              // TODO: Navigate to blog post creation
              console.log('Navigate to create blog post')
            }}
          >
            Write Your First Post
          </Button>
        </View>
      )}
    </View>
  )
}

export default BlogsTab
