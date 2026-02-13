import React, { useState, useMemo } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Comment from 'components/Comment'
import { useTheme } from 'hooks/useTheme'
import { PostProps } from '../../../../types'
import { mockBlogComments, MockBlogComment } from 'data/mockBlogs'

interface BlogCommentsProps {
  blogId: string
}

const toPostProps = (comment: MockBlogComment): PostProps => ({
  id: comment.id,
  postText: comment.text,
  user: comment.author,
  createdAt: new Date(comment.createdAt),
  amountOfKorems: comment.amountOfLikes,
  amountOfComments: 0,
  reactors: [],
  isReactor: false,
  privacyType: 'public',
  userId: comment.author.id,
})

const BlogComments: React.FC<BlogCommentsProps> = ({ blogId }) => {
  const { isDarkMode } = useTheme()
  const [showInput, setShowInput] = useState(false)
  const [commentText, setCommentText] = useState('')

  const comments = useMemo(
    () => mockBlogComments.filter((c) => c.blogId === blogId),
    [blogId]
  )

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    // Mock: just clear the input for now
    setCommentText('')
    setShowInput(false)
  }

  const renderItem = ({ item }: { item: MockBlogComment }) => (
    <Comment comment={toPostProps(item)} />
  )

  const renderEmpty = () => (
    <View style={tw`flex-1 items-center justify-center py-20`}>
      <Ionicons name="chatbubble-outline" size={48} color="#9CA3AF" />
      <Text
        style={tw`text-base font-semibold text-gray-500 dark:text-gray-400 mt-4`}
      >
        No comments yet
      </Text>
      <Text style={tw`text-sm text-gray-400 dark:text-gray-500 mt-1`}>
        Be the first to comment
      </Text>
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
        {/* Comments Header */}

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={comments.length === 0 ? tw`flex-1` : tw`pb-24`}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        {showInput && (
          <View
            style={tw`px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}
          >
            <View style={tw`flex-row items-end`}>
              <TextInput
                style={tw`flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2 text-gray-900 dark:text-white max-h-[100px]`}
                placeholder="Write a comment..."
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                autoFocus
              />
              <TouchableOpacity
                style={tw`ml-2 bg-green-500 rounded-full w-10 h-10 items-center justify-center ${
                  !commentText.trim() ? 'opacity-50' : ''
                }`}
                onPress={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Ionicons name="send" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Floating Add Comment Button */}
        {!showInput && (
          <TouchableOpacity
            style={tw`absolute bottom-6 right-6 bg-green-500 rounded-full w-14 h-14 items-center justify-center shadow-lg`}
            onPress={() => setShowInput(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default BlogComments
