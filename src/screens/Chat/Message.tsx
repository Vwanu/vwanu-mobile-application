import React, { useRef } from 'react'
import { InferType, object, string } from 'yup'
import {
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
} from 'store/conversation-api-slice'
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
  const { user, conversationId } = route.params
  const currentUserId = useSelector((state: RootState) => state.auth.userId)
  const {
    data: messagesData,
    isLoading,
    isFetching,
  } = useFetchMessagesQuery({ conversationId })
  const [createMessage] = useCreateMessageMutation()

  //   console.log('Messages data:', messagesData)

  const handleSubmit = (values: FormValues) => {
    // console.log('Form submitted with values:', values)
    createMessage({
      conversationId,
      messageText: values.messageText,
    })
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
      <View style={tw`px-3 py-2 bg-gray-100`}>
        <Text appearance="hint" category="c1" style={tw`text-center`}>
          Yesterday
        </Text>
      </View>
      <View style={tw`bg-white p-2 flex-1`}>
        <FlatList
          data={messagesData?.data || []}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={(e) => {
            // console.log('Rendering separator', e)
            return <View style={tw`my-2`} />
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
