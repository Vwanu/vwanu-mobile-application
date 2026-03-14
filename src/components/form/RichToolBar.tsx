import React, { useState } from 'react'
import { TouchableOpacity, View, Keyboard } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill'

import tw from 'lib/tailwind'

interface RichToolBarProps {
  editor: React.RefObject<QuillEditor>
}

const RichToolBar: React.FC<RichToolBarProps> = ({ editor }) => {
  const [keyBoardVisible, setKeyboardVisible] = useState(true)

  Keyboard.addListener('keyboardWillShow', () => {
    setKeyboardVisible(true)
  })
  Keyboard.addListener('keyboardWillHide', () => {
    setKeyboardVisible(false)
  })
  return (
    <View style={tw`px-2 pb-2 bg-white mb-2`}>
      <View
        style={tw`flex flex-row items-center border border-gray-400 rounded-3xl px-2`}
      >
        <View style={tw`flex-1 flex-shrink overflow-hidden`}>
          <QuillToolbar
            editor={editor}
            options={'full'}
            theme="light"
            styles={{
              toolbar: {
                root: () => tw`bg-white border-0`,
                provider: () => tw`bg-white`,
              },
            }}
          />
        </View>
        {keyBoardVisible && (
          <TouchableOpacity
            style={tw`ml-1 flex-shrink-0`}
            onPress={() => {
              Keyboard.dismiss()
            }}
          >
            <MaterialCommunityIcons name="keyboard-off-outline" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default RichToolBar
