import React, { useRef, useEffect, useCallback } from 'react'
import { InferType, object, string } from 'yup'
import {
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ViewToken,
  Keyboard,
} from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import ChatBubble from './components/Chatbubble'
import { ChatStackParams } from '../../../types'
import { useSelector } from 'react-redux'
import ProfAvatar from 'components/ProfAvatar'
import {
  useFetchMessagesQuery,
  useCreateMessageMutation,
  useMarkMessageAsReadMutation,
} from 'store/conversation-api-slice'
import { Message as MessageType } from '../../../types'
import { Form, Field, Submit } from 'components/form'
import { isToday } from 'date-fns'

type MessageScreenRouteProp = RouteProp<ChatStackParams, 'Message'>

const validationSchema = object().shape({
  messageText: string().label('Message Text'),
})
type FormValues = InferType<typeof validationSchema>

const formValues: FormValues = {
  messageText: '',
}
const Message: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<MessageScreenRouteProp>()
  const flatListRef = useRef<FlatList>(null)
  const { user, conversationId } = route.params
  const currentUserId = useSelector((state: RootState) => state.auth.userId)
  const [hasText, setHasText] = React.useState(false)

  const {
    data: messagesData,
    isLoading,
    isFetching,
  } = useFetchMessagesQuery({ conversationId })
  const [createMessage] = useCreateMessageMutation()
  const [markMessageAsRead] = useMarkMessageAsReadMutation()

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60, // Item is considered visible when 50% is shown
  }).current

  // Handle marking messages as read when they come into view
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.forEach((viewableItem) => {
        const message = viewableItem.item as MessageType
        // Only mark messages from other users that haven't been marked yet
        if (
          message &&
          message.user?.id !== currentUserId &&
          !message.id.startsWith('temp-') &&
          !message.readDate
        ) {
          markMessageAsRead({
            conversationId,
            messageId: message.id,
          })
        }
      })
    },
    [conversationId, currentUserId, markMessageAsRead]
  )
  // Auto-scroll to end when new messages arrive
  useEffect(() => {
    if (messagesData?.data?.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messagesData?.data?.length])

  const handleSubmit = (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    const currentUser = {
      id: currentUserId || '',
      firstName: 'Me',
      lastName: '',
      profilePicture: '',
    }
    createMessage({
      conversationId,
      messageText: values.messageText || '',
      user: currentUser as any,
    })
    resetForm()
    setHasText(false)
    Keyboard.dismiss()
  }

  const renderedSeparatorSet = new Set<string>()
  const dateSeparator = (messageDate: string) => {
    if (isToday(new Date(messageDate))) {
      if (renderedSeparatorSet.size === 0) return
      else messageDate = 'Today'
    }
    if (renderedSeparatorSet.has(messageDate)) return null
    renderedSeparatorSet.add(messageDate)
    return (
      <View style={tw`px-3 py-2 bg-gray-100 my-1`}>
        <Text appearance="hint" category="c1" style={tw`text-center my-1`}>
          {messageDate}
        </Text>
      </View>
    )
  }
  return (
    <Screen loading={isLoading || isFetching}>
      <View
        style={tw`flex-row items-center p-3 bg-white border-b border-gray-200`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={tw.color('text-gray-800')}
          />
        </TouchableOpacity>
        <View style={tw`flex-1`}>
          <ProfAvatar user={user as User} showOnlineStatus />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        style={tw`flex-1`}
      >
        <FlatList
          ref={flatListRef}
          data={messagesData?.data || []}
          extraData={messagesData?.data?.length}
          keyExtractor={(item) => item.id.toString()}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          ItemSeparatorComponent={(e) => {
            const newDateSeparator = dateSeparator(
              new Date(e.leadingItem.createdAt || '').toDateString()
            )
            return newDateSeparator ?? <View style={tw`mt-2`} />
          }}
          renderItem={({ item }) => (
            <ChatBubble
              {...item}
              isMessageFromCurrentUser={item.user.id === currentUserId}
            />
          )}
          contentContainerStyle={tw`p-3 pb-10`}
          style={tw`flex-1 mb-3`}
        />

        <Form
          validationSchema={validationSchema}
          initialValues={formValues}
          onSubmit={handleSubmit}
        >
          <View
            style={tw`flex flex-row items-center justify-center align-middle`}
          >
            <Field
              label="Type your message..."
              key="messageText"
              style={tw`mb-2 rounded-lg border border-gray-300 px-3 py-2 flex-1`}
              name="messageText"
              onTextUpdate={(text) => {
                setTimeout(() => {
                  setHasText(!!text)
                }, 100)
              }}
              autoCorrect={true}
            />

            <Submit
              disabled={!hasText}
              style={tw`ml-2 p-2`}
              appearance="ghost"
              accessoryRight={() => (
                <MaterialCommunityIcons
                  name="send"
                  size={24}
                  color={hasText ? '#3B82F6' : '#D1D5DB'} // color if we have text : blue-500 else gray-300
                />
              )}
            />
          </View>
        </Form>
        {/* </View> */}
      </KeyboardAvoidingView>
    </Screen>
  )
}

export default Message
