import * as Yup from 'yup'
import React, { useRef } from 'react'
import {
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import QuillEditor from 'react-native-cn-quill'
import { FormikProps, useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import StatPill from 'components/StatPill'
import { Field, Form } from 'components/form'
import { colors } from 'components/ui/tokens'
import { useFetchInterestsQuery } from '../../../store/interests'

import RichToolBar from 'components/form/RichToolBar'
import RichTextEditor from '../../../components/form/RichTextEditor'

const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(20, 'Content must be at least 20 characters')
    .required('Content is required'),
})

const initialValues = {
  title: '',
  content: '',
}

const TitleField = ({ light }: { light?: boolean }) => {
  const { values } = useFormikContext<typeof initialValues>()
  const hasTitle = !!values.title?.trim()

  return (
    <View
      style={!light && !hasTitle ? tw`border-b border-b-gray-300` : undefined}
    >
      <Field
        name="title"
        placeholder="Title"
        style={tw`border-0 bg-transparent`}
        textStyle={tw`text-3xl font-syne-bold ${light ? 'text-white' : ''}`}
        required
        autoFocus
        multiline
      />
    </View>
  )
}

const countWords = (html: string) => {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
  return text ? text.split(/\s+/).length : 0
}

const WORDS_PER_MINUTE = 200

const WordCount = () => {
  const { values } = useFormikContext<typeof initialValues>()
  const words = countWords(values.content || '')
  const minutesRead = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))

  return (
    <View style={tw`px-4 py-1.5  border-t border-warm-border `}>
      <Text style={tw`text-xs font-poppins text-mute text-right`}>
        {words} {words === 1 ? 'word' : 'words'}
        {words > 0 ? `  ·  ${minutesRead} min read` : ''}
      </Text>
    </View>
  )
}

const FLOAT_SURFACE = 'rgba(255,255,255,0.18)'

const HeroActionBar = ({
  onClose,
  onSave,
  isSubmitting,
}: {
  onClose?: () => void
  onSave?: () => void
  isSubmitting?: boolean
}) => (
  <View style={tw`flex-row items-center justify-between`}>
    <View style={tw`flex-row items-center`}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.85}
        style={[
          tw`w-9 h-9 rounded-full items-center justify-center border border-white/30`,
          { backgroundColor: FLOAT_SURFACE },
        ]}
      >
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <View
        style={[
          tw`ml-2 px-2.5 py-1 rounded-full`,
          { backgroundColor: colors.amberSoft },
        ]}
      >
        <Text
          style={[tw`font-poppins-bold text-xs`, { color: colors.amberDeep }]}
        >
          Draft
        </Text>
      </View>
    </View>

    <View style={tw`flex-row items-center`}>
      <TouchableOpacity
        onPress={onSave}
        disabled={isSubmitting}
        activeOpacity={0.85}
        style={[
          tw`w-9 h-9 rounded-full items-center justify-center border border-white/30 mr-2`,
          { backgroundColor: FLOAT_SURFACE },
        ]}
      >
        <Ionicons name="save-outline" size={18} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSave}
        disabled={isSubmitting}
        activeOpacity={0.85}
        style={[
          tw`px-4 py-2 rounded-full flex-row items-center`,
          { backgroundColor: colors.primaryDeep },
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={tw`text-white font-poppins-bold text-xs`}>Publish</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
)

interface BlogContentProps {
  formRef?: React.Ref<FormikProps<typeof initialValues>>
  onSubmit: (values: typeof initialValues) => void
  values?: typeof initialValues
  interestIds?: string[]
  coverImage?: string
  onClose?: () => void
  onSave?: () => void
  isSubmitting?: boolean
}

const BlogContent: React.FC<BlogContentProps> = ({
  formRef,
  onSubmit,
  values,
  interestIds,
  coverImage,
  onClose,
  onSave,
  isSubmitting,
}) => {
  const editorRef = useRef<QuillEditor>(null)
  const formInitialValues = values || initialValues
  const [contentFocused, setContentFocused] = React.useState(false)
  const [toolbarBusy, setToolbarBusy] = React.useState(false)

  const { data: interests } = useFetchInterestsQuery()
  const selectedInterests = interests?.filter((interest) =>
    interestIds?.map(String).includes(String(interest.id))
  )

  // load a default placeholder image if coverImage is not provided
  const coverImageUrl = coverImage ? { uri: coverImage } : undefined

  const renderInterestPills = () => {
    if (!selectedInterests || selectedInterests.length === 0) return null
    return (
      <View style={tw`flex-row flex-wrap gap-2 mb-2`}>
        {selectedInterests.map((interest) => (
          <StatPill key={interest.id} icon="pricetag" label={interest.name} />
        ))}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Form
        validationSchema={ValidationSchema}
        initialValues={formInitialValues}
        style={tw`flex-1`}
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        <View style={tw`flex-1`}>
          <ImageBackground
            source={coverImageUrl}
            style={[tw`w-full`, { minHeight: 240 }]}
          >
            <LinearGradient
              colors={['rgba(27,31,94,0.55)', 'rgba(27,31,94,0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={tw`flex-1 px-4 pb-2`}
            >
              <SafeAreaView style={tw`flex-1`}>
                <HeroActionBar
                  onClose={onClose}
                  onSave={onSave}
                  isSubmitting={isSubmitting}
                />
                <View style={tw`mt-auto`}>
                  {renderInterestPills()}
                  <TitleField light />
                </View>
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>

          <RichTextEditor
            name="content"
            required
            placeholder="Write your story…"
            editorRef={editorRef}
            initialValue={formInitialValues.content}
            onFocusChange={setContentFocused}
          />
        </View>
        {(contentFocused || toolbarBusy) && (
          <>
            <WordCount />
            <RichToolBar
              editor={editorRef}
              onInteractingChange={setToolbarBusy}
            />
          </>
        )}
      </Form>
    </KeyboardAvoidingView>
  )
}

export default BlogContent
