import React, { useRef, useEffect, useCallback } from 'react'
import { InferType, object, string } from 'yup'
import {
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ViewToken,
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

type MessageScreenRouteProp = RouteProp<ChatStackParams, 'Message'>

const validationSchema = object().shape({
  messageText: string()
    .label('Message Text')
    .required('Message text is required'),
})
type FormValues = InferType<typeof validationSchema>

const formValues: FormValues = {
  messageText: '',
}
const Message: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<MessageScreenRouteProp>()
  const formRef = useRef<View>(null)
  const flatListRef = useRef<FlatList>(null)
  const markedAsReadRef = useRef<Set<string>>(new Set())
  const { user, conversationId } = route.params
  const currentUserId = useSelector((state: RootState) => state.auth.userId)
  const {
    data: messagesData,
    isLoading,
    isFetching,
  } = useFetchMessagesQuery({ conversationId })
  const [createMessage] = useCreateMessageMutation()
  const [markMessageAsRead] = useMarkMessageAsReadMutation()

  // Viewability config for detecting messages in viewport
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is shown
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
          !markedAsReadRef.current.has(message.id)
        ) {
          markedAsReadRef.current.add(message.id)
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
      messageText: values.messageText,
      user: currentUser as any,
    })
    resetForm()
  }

  const renderedSeparatorSet = new Set<string>()
  const dateSeparator = (messageDate: string) => {
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
          <ProfAvatar
            source={user?.profilePicture}
            name={`${user?.firstName || ''} ${user?.lastName || ''}`}
            size={40}
            subtitle="Online"
          />
        </View>
      </View>

      <View style={tw`bg-white p-2 flex-1`}>
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
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
        >
          <Form
            validationSchema={validationSchema}
            initialValues={formValues}
            onSubmit={handleSubmit}
          >
            <View style={tw`flex flex-row items-center`} ref={formRef}>
              <Field
                label="Type your message..."
                key="messageText"
                style={tw`mb-2 rounded-lg border border-gray-300 px-3 py-2`}
                name="messageText"
                style={tw`flex-1`}
              />

              <Submit
                appearance="ghost"
                accessoryRight={() => (
                  <MaterialCommunityIcons
                    name="send"
                    size={24}
                    color={'#D1D5DB'}
                  />
                )}
              />
            </View>
          </Form>
        </KeyboardAvoidingView>
      </View>
    </Screen>
  )
}

export default Message
