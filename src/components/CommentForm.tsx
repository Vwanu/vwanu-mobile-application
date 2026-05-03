import React, { useRef, forwardRef, useImperativeHandle, useState } from 'react'
import { string, object, mixed, InferType } from 'yup'
import {
  View,
  Platform,
  Keyboard,
  Animated,
  StyleSheet,
  TextInput,
  Text,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import { Notice } from '../../types'
import { Form, MentionInput, Submit } from './form'
import { useCreateCommentMutation } from 'store/post'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from 'hooks/useTheme'
import extractMentionIds from 'utils/extractMentionIds'

const validationSchema = object().shape({
  postText: string().label('Comment'),
  postId: string().required('Post Id is required'),
  privacyType: mixed<Notice>().required().label('Privacy Type'),
})

type FormValues = InferType<typeof validationSchema>

interface CommentFormProps {
  postId: string
  onSubmit?: () => void
  off?: number
}

export type CommentFormHandle = {
  focus: () => void
}

const CommentForm = forwardRef<CommentFormHandle, CommentFormProps>(
  ({ postId, onSubmit, off = 40 }, ref) => {
    const insets = useSafeAreaInsets()
    const [formValues] = React.useState<FormValues>({
      postText: '',
      postId: postId,
      privacyType: 'public',
    })

    const [createComment] = useCreateCommentMutation()
    const [commentText, setCommentText] = useState('')
    const [inputHeight, setInputHeight] = useState(40)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const translateY = React.useRef(new Animated.Value(0)).current
    const sendButtonScale = React.useRef(new Animated.Value(1)).current
    const inputRef = useRef<TextInput>(null)
    const { isDarkMode } = useTheme()

    React.useEffect(() => {
      const keyboardWillShow = (event: any) => {
        const keyboardHeight = event.endCoordinates.height
        const offset = Platform.OS === 'ios' ? 0 : insets.bottom
        Animated.timing(translateY, {
          toValue: -keyboardHeight + off,
          duration: event.duration,
          useNativeDriver: true,
        }).start()
      }

      const keyboardWillHide = (event: any) => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: event.duration,
          useNativeDriver: true,
        }).start()
      }

      const showSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        keyboardWillShow
      )
      const hideSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        keyboardWillHide
      )

      return () => {
        showSubscription.remove()
        hideSubscription.remove()
      }
    }, [insets.bottom])

    const handleSubmit = async (values: any, { resetForm }: any) => {
      const postText = values.postText || ''
      if (postText.trim().length === 0) return

      setIsSubmitting(true)

      // Animate send button
      Animated.sequence([
        Animated.timing(sendButtonScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(sendButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()

      try {
        const mentions = extractMentionIds(postText)
        await createComment({ ...values, postText, mentions })
        onSubmit?.()
        resetForm()
        setCommentText('')
        setInputHeight(40)
        Keyboard.dismiss()
      } catch (error) {
        console.error('Error submitting comment:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleTextChange = (text: string) => {
      if (text.length <= MAX_CHARACTERS) {
        setCommentText(text)
      }
    }

    const handleContentSizeChange = (event: any) => {
      const height = Math.min(
        Math.max(40, event.nativeEvent.contentSize.height),
        120
      )
      setInputHeight(height)
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
        console.log('CommentForm focus called, inputRef:', inputRef.current)
        if (inputRef.current) {
          console.log('Attempting to focus TextInput...')
          inputRef.current.focus()
          console.log('Focus called on TextInput')
        } else {
          console.log('inputRef.current is null/undefined')
        }
      },
    }))

    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <Form
          validationSchema={validationSchema}
          initialValues={formValues}
          onSubmit={handleSubmit}
          style={styles.formContainer}
        >
          <CommentFormContent
            commentText={commentText}
            setCommentText={setCommentText}
            inputHeight={inputHeight}
            handleContentSizeChange={handleContentSizeChange}
            isSubmitting={isSubmitting}
            sendButtonScale={sendButtonScale}
            isDarkMode={isDarkMode}
          />
        </Form>
      </Animated.View>
    )
  }
)

const MAX_CHARACTERS = 500

const CommentFormContent: React.FC<{
  commentText: string
  setCommentText: (text: string) => void
  inputHeight: number
  handleContentSizeChange: (event: any) => void
  isSubmitting: boolean
  sendButtonScale: Animated.Value
  isDarkMode: boolean
}> = ({
  commentText,
  setCommentText,
  inputHeight,
  handleContentSizeChange,
  isSubmitting,
  sendButtonScale,
  isDarkMode,
}) => {
  const { values } = useFormikContext<any>()
  const postText = values.postText || ''

  React.useEffect(() => {
    setCommentText(postText)
  }, [postText])

  const remainingChars = MAX_CHARACTERS - commentText.length

  return (
    <View style={[styles.inputContainer]}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDarkMode
              ? tw.color('bg-gray-300')
              : tw.color('bg-white'),
          },
        ]}
      >
        <MentionInput
          multiline
          name="postText"
          onContentSizeChange={handleContentSizeChange}
          style={[styles.textInput, { height: inputHeight }]}
          placeholder="Write a comment..."
          placeholderTextColor="#9CA3AF"
          maxLength={MAX_CHARACTERS}
          textAlignVertical="top"
        />

        {/* Character counter */}
        <View style={styles.characterCounter}>
          <Text
            style={[
              styles.counterText,
              remainingChars < 50 && styles.counterWarning,
              remainingChars === 0 && styles.counterError,
            ]}
          >
            {remainingChars}
          </Text>
        </View>
      </View>

      {/* Send button */}
      <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
        <Submit
          appearance="ghost"
          disabled={commentText.trim().length === 0 || isSubmitting}
          accessoryRight={() =>
            isSubmitting ? (
              <MaterialCommunityIcons
                name="loading"
                size={18}
                color={
                  commentText.trim().length > 0
                    ? tw.color('bg-primary')
                    : '#D1D5DB'
                }
              />
            ) : (
              <MaterialCommunityIcons
                name="send"
                size={18}
                color={
                  commentText.trim().length > 0
                    ? tw.color('bg-primary')
                    : '#D1D5DB'
                }
              />
            )
          }
          size="small"
          style={[
            styles.sendButton,
            commentText.trim().length > 0 && styles.sendButtonActive,
          ]}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 1,
    position: 'relative',
  },
  textInput: {
    fontSize: 16,
    color: '#374151',
    paddingRight: 0, // Space for character counter
    minHeight: 40,
    maxHeight: 120,
  },
  characterCounter: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  counterText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  counterWarning: {
    color: '#F59E0B',
  },
  counterError: {
    color: '#EF4444',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  sendButtonActive: {
    backgroundColor: '#EBF4FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
})

export default CommentForm
