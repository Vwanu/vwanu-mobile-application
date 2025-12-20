import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'

const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: {
  icon: string
  title: string
  subtitle?: string
  onPress?: () => void
  rightElement?: React.ReactNode
}) => (
  <TouchableOpacity
    style={tw`flex-row items-center p-4 bg-white border-b border-gray-100`}
    onPress={onPress}
    disabled={!onPress}
  >
    <View
      style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center`}
    >
      <Ionicons name={icon as any} size={20} color="#6B7280" />
    </View>
    <View style={tw`flex-1 ml-3`}>
      <Text style={tw`font-semibold text-base`}>{title}</Text>
      {subtitle && (
        <Text style={tw`text-gray-600 text-sm mt-0.5`}>{subtitle}</Text>
      )}
    </View>
    {rightElement || (
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    )}
  </TouchableOpacity>
)

export default SettingItem
