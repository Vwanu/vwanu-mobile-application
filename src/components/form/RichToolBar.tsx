import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Modal,
  TextInput,
  Pressable,
} from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import QuillEditor from 'react-native-cn-quill'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'

interface RichToolBarProps {
  editor: React.RefObject<QuillEditor>
}

type MdiName = keyof typeof MaterialCommunityIcons.glyphMap

const INLINE_FORMATS: { name: string; icon: MdiName }[] = [
  { name: 'bold', icon: 'format-bold' },
  { name: 'italic', icon: 'format-italic' },
  { name: 'underline', icon: 'format-underline' },
  { name: 'strike', icon: 'format-strikethrough-variant' },
]

const BLOCK_FORMATS: { name: string; icon: MdiName }[] = [
  { name: 'blockquote', icon: 'format-quote-close' },
  { name: 'code-block', icon: 'code-tags' },
]

const TEXT_STYLES: { label: string; short: string; value: number | false }[] = [
  { label: 'Normal', short: 'Normal', value: false },
  { label: 'Heading 1', short: 'H1', value: 1 },
  { label: 'Heading 2', short: 'H2', value: 2 },
  { label: 'Heading 3', short: 'H3', value: 3 },
]

const RichToolBar: React.FC<RichToolBarProps> = ({ editor }) => {
  const [activeFormats, setActiveFormats] = useState<Record<string, any>>({})
  const [styleMenuOpen, setStyleMenuOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => {
    const instance = editor.current
    if (!instance) return
    const handler = (data: any) => setActiveFormats(data?.formats || {})
    instance.on('format-change', handler)
    return () => instance.off('format-change', handler)
  }, [editor])

  const toggle = (name: string, value: any = true) => {
    const isActive = activeFormats[name]
    editor.current?.format(name, isActive ? false : value)
  }

  const applyHeader = (value: number | false) => {
    editor.current?.format('header', value)
    setStyleMenuOpen(false)
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    if (url) editor.current?.format('link', url)
    setLinkUrl('')
    setLinkModalOpen(false)
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (result.canceled || !result.assets[0]) return
    const range = await editor.current?.getSelection()
    editor.current?.insertEmbed(
      range?.index ?? 0,
      'image',
      result.assets[0].uri
    )
  }

  const currentStyle =
    TEXT_STYLES.find((s) => s.value === (activeFormats.header || false)) ??
    TEXT_STYLES[0]

  const IconButton = ({
    active,
    onPress,
    icon,
  }: {
    active?: boolean
    onPress: () => void
    icon: MdiName
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`w-9 h-9 rounded-full items-center justify-center mr-1`,
        active ? { backgroundColor: colors.primarySoft } : undefined,
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={active ? colors.primaryDeep : colors.soft}
      />
    </TouchableOpacity>
  )

  return (
    <View style={tw`bg-warm-bg border-t border-warm-border px-2 py-2`}>
      <View style={tw`flex-row items-center`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={tw`items-center`}
        >
          {/* Text style dropdown */}
          <TouchableOpacity
            onPress={() => setStyleMenuOpen(true)}
            style={[
              tw`flex-row items-center h-9 px-3 rounded-full mr-2`,
              { backgroundColor: colors.primarySoft },
            ]}
          >
            <Text
              style={[
                tw`text-sm font-poppins-medium mr-1`,
                { color: colors.primaryDeep },
              ]}
            >
              {currentStyle.short}
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={colors.primaryDeep}
            />
          </TouchableOpacity>

          <View style={tw`w-px h-6 bg-warm-border mr-2`} />

          {INLINE_FORMATS.map((f) => (
            <IconButton
              key={f.name}
              icon={f.icon}
              active={!!activeFormats[f.name]}
              onPress={() => toggle(f.name)}
            />
          ))}

          <View style={tw`w-px h-6 bg-warm-border mx-1`} />

          {BLOCK_FORMATS.map((f) => (
            <IconButton
              key={f.name}
              icon={f.icon}
              active={!!activeFormats[f.name]}
              onPress={() => toggle(f.name)}
            />
          ))}

          <View style={tw`w-px h-6 bg-warm-border mx-1`} />

          <IconButton
            icon="link-variant"
            active={!!activeFormats.link}
            onPress={() => setLinkModalOpen(true)}
          />
          <IconButton icon="image-outline" onPress={pickImage} />
        </ScrollView>

        <TouchableOpacity
          style={tw`ml-2 w-9 h-9 items-center justify-center`}
          onPress={() => Keyboard.dismiss()}
        >
          <MaterialCommunityIcons
            name="keyboard-off-outline"
            size={22}
            color={colors.soft}
          />
        </TouchableOpacity>
      </View>

      {/* Text style menu */}
      <Modal
        transparent
        visible={styleMenuOpen}
        animationType="fade"
        onRequestClose={() => setStyleMenuOpen(false)}
      >
        <Pressable
          style={tw`flex-1 justify-end`}
          onPress={() => setStyleMenuOpen(false)}
        >
          <View style={tw`bg-warm-surface rounded-t-3xl pt-2 pb-8 px-4`}>
            <View style={tw`items-center pb-2`}>
              <View style={tw`w-10 h-1 rounded-full bg-warm-border`} />
            </View>
            {TEXT_STYLES.map((s) => {
              const active = s.value === (activeFormats.header || false)
              return (
                <TouchableOpacity
                  key={s.short}
                  onPress={() => applyHeader(s.value)}
                  style={[
                    tw`flex-row items-center justify-between px-4 py-3 rounded-2xl`,
                    active
                      ? { backgroundColor: colors.primarySoft }
                      : undefined,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-poppins-medium`,
                      {
                        color: active ? colors.primaryDeep : colors.ink,
                        fontSize:
                          s.value === 1
                            ? 22
                            : s.value === 2
                            ? 19
                            : s.value === 3
                            ? 17
                            : 15,
                      },
                    ]}
                  >
                    {s.label}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primaryDeep}
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Link input */}
      <Modal
        transparent
        visible={linkModalOpen}
        animationType="fade"
        onRequestClose={() => setLinkModalOpen(false)}
      >
        <Pressable
          style={tw`flex-1 items-center justify-center px-8 bg-black/40`}
          onPress={() => setLinkModalOpen(false)}
        >
          <Pressable style={tw`w-full bg-warm-surface rounded-2xl p-4`}>
            <Text
              style={[tw`font-syne-bold text-lg mb-3`, { color: colors.ink }]}
            >
              Add link
            </Text>
            <TextInput
              value={linkUrl}
              onChangeText={setLinkUrl}
              placeholder="https://example.com"
              placeholderTextColor={colors.mute}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              autoFocus
              style={[
                tw`border border-warm-border rounded-xl px-3 py-2.5 font-poppins`,
                { color: colors.ink },
              ]}
            />
            <View style={tw`flex-row justify-end mt-4`}>
              <TouchableOpacity
                onPress={() => setLinkModalOpen(false)}
                style={tw`px-4 py-2 mr-2`}
              >
                <Text style={[tw`font-poppins-medium`, { color: colors.soft }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyLink}
                style={[
                  tw`px-5 py-2 rounded-full`,
                  { backgroundColor: colors.primaryDeep },
                ]}
              >
                <Text style={tw`text-white font-poppins-semibold`}>Add</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

export default RichToolBar
