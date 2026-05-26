import React from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
} from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { string, object } from 'yup'
import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { Form, MentionInput } from 'components/form'
import extractMentionIds from 'utils/extractMentionIds'
import { colors } from 'components/ui/tokens'

const BODY_MAX = 1000
const BODY_NEAR_LIMIT = 900

const ValidationSchema = object().shape({
  title: string().required().min(1).label('Title'),
  body: string().max(BODY_MAX).label('Body'),
})

interface FormValues {
  title: string
  body?: string
}

interface SheetContentProps {
  onClose: () => void
  categoryName?: string
}

const SheetContent: React.FC<SheetContentProps> = ({
  onClose,
  categoryName,
}) => {
  const { values, setFieldValue, handleSubmit } = useFormikContext<FormValues>()
  const body = values.body ?? ''
  const isReady = values.title.trim().length > 0
  const bodyLen = body.length
  const nearLimit = bodyLen >= BODY_NEAR_LIMIT
  const overLimit = bodyLen > BODY_MAX

  return (
    <>
      <View style={tw`items-center pt-2 pb-1`}>
        <View
          style={[
            tw`h-1 w-12 rounded-full`,
            { backgroundColor: colors.warmBorderStrong },
          ]}
        />
      </View>

      <View style={tw`flex-row items-center justify-between px-4 pt-3 pb-4`}>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={tw`w-9 h-9 items-center justify-center`}
        >
          <Ionicons name="close" size={22} color={colors.soft} />
        </TouchableOpacity>

        <Text style={tw`font-syne-bold text-base text-ink`}>
          New Discussion
        </Text>

        <TouchableOpacity
          onPress={() => handleSubmit()}
          disabled={!isReady || overLimit}
          activeOpacity={0.85}
          style={[
            tw`px-4 py-2 rounded-full`,
            {
              backgroundColor:
                isReady && !overLimit ? colors.amber : colors.warmBorder,
            },
          ]}
        >
          <Text
            style={[
              tw`font-poppins-bold text-xs`,
              { color: isReady && !overLimit ? '#FFFFFF' : colors.mute },
            ]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      {categoryName ? (
        <View style={tw`px-4 mb-3`}>
          <View
            style={[
              tw`flex-row items-center self-start px-3 py-1.5 rounded-full`,
              { backgroundColor: colors.primarySoft },
            ]}
          >
            <Ionicons
              name="chatbubbles-outline"
              size={12}
              color={colors.primaryDeep}
            />
            <Text
              style={[
                tw`ml-1.5 font-poppins-medium text-xs`,
                { color: colors.primaryDeep },
              ]}
            >
              Posting in {categoryName}
            </Text>
          </View>
        </View>
      ) : null}

      <ScrollView
        style={tw`flex-1 px-4`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          value={values.title}
          onChangeText={(text) => setFieldValue('title', text)}
          placeholder="Discussion title"
          placeholderTextColor={colors.mute}
          style={[tw`font-syne-bold text-xl pb-3`, { color: colors.ink }]}
          multiline
        />
        <View style={[tw`h-px mb-3`, { backgroundColor: colors.warmBorder }]} />

        <MentionInput
          name="body"
          placeholder="What would you like to discuss?"
          placeholderTextColor={colors.mute}
          style={[
            tw`font-poppins text-base pb-3 min-h-40`,
            { color: colors.soft, textAlignVertical: 'top' },
          ]}
          multiline
          textAlignVertical="top"
          maxLength={BODY_MAX + 1}
        />

        <View style={tw`flex-row justify-end pb-2`}>
          <Text
            style={[
              tw`font-poppins-medium text-xs`,
              {
                color: overLimit
                  ? colors.coral
                  : nearLimit
                  ? colors.coral
                  : colors.mute,
              },
            ]}
          >
            {bodyLen}/{BODY_MAX}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          tw`flex-row items-center px-4 py-3 border-t`,
          { borderColor: colors.warmBorder },
        ]}
      >
        <ActionPill icon="image-outline" label="Photo" />
        <ActionPill icon="link-outline" label="Link" />
        <ActionPill mc icon="poll" label="Poll" />
      </View>
    </>
  )
}

interface ActionPillProps {
  icon: string
  label: string
  mc?: boolean
  onPress?: () => void
}

const ActionPill: React.FC<ActionPillProps> = ({
  icon,
  label,
  mc = false,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[
      tw`flex-row items-center px-3 py-2 rounded-full mr-2 border`,
      {
        backgroundColor: colors.warmSurface,
        borderColor: colors.warmBorder,
      },
    ]}
  >
    {mc ? (
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={colors.primaryDeep}
      />
    ) : (
      <Ionicons name={icon as any} size={16} color={colors.primaryDeep} />
    )}
    <Text
      style={[
        tw`ml-1.5 font-poppins-medium text-xs`,
        { color: colors.primaryDeep },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
)

interface Props {
  visible: boolean
  onClose: () => void
  onSubmit: (title: string, body: string, mentions?: string[]) => void
  categoryName?: string
}

const CreateDiscussionForm: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  categoryName,
}) => {
  const handleFormSubmit = ({ title, body }: FormValues) => {
    const bodyText = body ?? ''
    const mentions = extractMentionIds(bodyText)
    onSubmit(title.trim(), bodyText.trim(), mentions)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 bg-black/40 justify-end`}>
          <TouchableOpacity
            activeOpacity={1}
            style={tw`flex-1`}
            onPress={onClose}
          />
          <View
            style={[
              tw`rounded-t-3xl pb-3`,
              {
                backgroundColor: colors.warmSurface,
                maxHeight: '90%',
                minHeight: 480,
              },
            ]}
          >
            <Form
              validationSchema={ValidationSchema}
              initialValues={{ title: '', body: '' }}
              onSubmit={handleFormSubmit}
              style={tw`flex-1`}
            >
              <SheetContent onClose={onClose} categoryName={categoryName} />
            </Form>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default CreateDiscussionForm
