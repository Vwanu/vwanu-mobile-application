import React, { useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { MentionInput } from 'components/form'
import { colors } from 'components/ui/tokens'
import { styles } from '../style'

interface Props {
  onTextChange?: (text: string) => void
}

const PostEditor: React.FC<Props> = ({ onTextChange }) => {
  const { values } = useFormikContext<{ postText?: string }>()
  const text = values.postText || ''

  useEffect(() => {
    onTextChange?.(text)
  }, [text, onTextChange])

  return (
    <ScrollView
      style={tw`px-2`}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <MentionInput
        name="postText"
        autoFocus
        placeholder="What's on your mind?"
        autoCapitalize="sentences"
        style={[styles.textInput]}
        multiline={true}
        textAlignVertical="top"
      />
      <View style={tw`flex-row justify-end pb-2`}>
        <Text
          style={[
            tw`font-poppins-medium text-xs`,
            { color: text.length > 280 ? colors.coral : colors.mute },
          ]}
        >
          {text.length}/500
        </Text>
      </View>
    </ScrollView>
  )
}

export default PostEditor
