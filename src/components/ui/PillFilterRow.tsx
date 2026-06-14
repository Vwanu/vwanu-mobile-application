import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native'
import tw from 'lib/tailwind'
import Text from 'components/Text'

export interface PillFilterOption {
  id: string
  label: string
  count?: number
}

export interface PillFilterRowProps {
  options: PillFilterOption[]
  value: string
  onChange: (id: string) => void
  scrollable?: boolean
  containerStyle?: StyleProp<ViewStyle>
}

const PillFilterRow: React.FC<PillFilterRowProps> = ({
  options,
  value,
  onChange,
  scrollable = true,
  containerStyle,
}) => {
  const pills = options.map((opt) => {
    const isActive = opt.id === value
    return (
      <TouchableOpacity
        key={opt.id}
        onPress={() => onChange(opt.id)}
        activeOpacity={0.8}
        style={tw`mr-2 px-4 py-2 rounded-full border flex-row items-center ${
          isActive
            ? 'bg-primary-deep border-primary-deep'
            : 'bg-primary-soft border-warm-border-strong'
        }`}
      >
        <Text
          style={tw`font-poppins-semibold text-xs ${
            isActive ? 'text-white' : 'text-primary-deep'
          }`}
        >
          {opt.label}
        </Text>
        {opt.count !== undefined && opt.count > 0 && (
          <View
            style={tw`ml-1.5 px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-white' : 'bg-primary-deep'
            }`}
          >
            <Text
              style={tw`font-poppins-bold text-[10px] ${
                isActive ? 'text-primary-deep' : 'text-white'
              }`}
            >
              {opt.count > 99 ? '99+' : String(opt.count)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    )
  })

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
        style={containerStyle}
      >
        {pills}
      </ScrollView>
    )
  }

  return (
    <View style={[tw`flex-row flex-wrap px-4`, containerStyle]}>{pills}</View>
  )
}

export default PillFilterRow
