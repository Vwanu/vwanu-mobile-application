import React from 'react'
import { View, ViewStyle, TextStyle, StyleProp } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Input from 'components/Input'
// import { useDebounce } from 'hooks/useDebounce'

export interface SearchBarProps {
  onSearchChange: (text: string) => void
  value?: string
  placeholder?: string
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<TextStyle>
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  value,
  placeholder = 'Search...',
  containerStyle,
  style,
}) => {
  // Debounce search query to avoid too many API calls
  //   const debouncedSearchQuery = useDebounce(searchQuery, 500)
  return (
    <View style={[tw`px-4 py-2 my-3 `, containerStyle]}>
      <Input
        placeholder={placeholder}
        value={value}
        iconLeft={
          <Ionicons name="search" size={24} color={tw.color('gray-400')} />
        }
        onChangeText={onSearchChange}
        style={[tw`rounded-full`, style]}
      />
    </View>
  )
}

export default SearchBar
