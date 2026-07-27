import React, { useRef } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import QuillEditor from 'react-native-cn-quill'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import { Form } from 'components/form'
import RichToolBar from 'components/form/RichToolBar'
import RichTextEditor from 'components/form/RichTextEditor'
import { useFetchInterestsQuery } from 'store/interests'

import { ValidationSchema, initialValues, BlogFormValues } from './schema'
import CoverHero from './CoverHero'
import WordCountBar from './WordCountBar'
import OverflowMenu from './OverflowMenu'
import ManageInterestsSheet from './ManageInterestsSheet'
import HeroActionBar from './HeroActionBar'
import TitleField from './TitleField'

interface BlogContentProps {
  formRef?: React.Ref<FormikProps<BlogFormValues>>
  onSubmit: (values: BlogFormValues) => void
  values?: BlogFormValues
  interestIds?: string[]
  coverImage?: string
  onClose?: () => void
  onSave?: () => void
  isSubmitting?: boolean
  isDraft?: boolean
  onCoverChange?: (uri: string) => void
  onInterestsChange?: (ids: string[]) => void
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
  isDraft,
  onCoverChange,
  onInterestsChange,
}) => {
  const editorRef = useRef<QuillEditor>(null)
  const formInitialValues = values || initialValues
  const [contentFocused, setContentFocused] = React.useState(false)
  const [toolbarBusy, setToolbarBusy] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [interestsOpen, setInterestsOpen] = React.useState(false)

  const { data: interests } = useFetchInterestsQuery()
  const selectedInterests = interests?.filter((interest) =>
    interestIds?.map(String).includes(String(interest.id))
  )

  const changeCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      onCoverChange?.(result.assets[0].uri)
    }
  }

  // Interests are required to publish — prompt for them instead of submitting.
  const handlePublish = () => {
    if (onInterestsChange && !interestIds?.length) {
      setInterestsOpen(true)
      return
    }
    onSave?.()
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
          <CoverHero
            coverImage={coverImage}
            interests={selectedInterests}
            onChangeCover={onCoverChange ? changeCover : undefined}
            onAddInterests={
              onInterestsChange ? () => setInterestsOpen(true) : undefined
            }
            titleComponent={<TitleField light />}
            headerComponent={
              <HeroActionBar
                onClose={onClose}
                onSave={handlePublish}
                onMenu={() => setMenuOpen(true)}
                isSubmitting={isSubmitting}
                isDraft={isDraft}
              />
            }
          />
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
            <WordCountBar />
            <RichToolBar
              editor={editorRef}
              onInteractingChange={setToolbarBusy}
            />
          </>
        )}
      </Form>

      <OverflowMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onChangeCover={onCoverChange ? changeCover : undefined}
        onManageInterests={
          onInterestsChange ? () => setInterestsOpen(true) : undefined
        }
        onSaveDraft={handlePublish}
      />

      <ManageInterestsSheet
        visible={interestsOpen}
        onClose={() => setInterestsOpen(false)}
        interestIds={interestIds}
        onChange={(ids) => {
          onInterestsChange?.(ids)
          setInterestsOpen(false)
        }}
      />
    </KeyboardAvoidingView>
  )
}

export default BlogContent
