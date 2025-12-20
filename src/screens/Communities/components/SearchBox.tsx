import React from 'react'
import { View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import tw from 'lib/tailwind'

import Input from 'components/Input'

interface SearchBoxProps {
  onSearch: (query: string) => void
  style?: object
  placeholder?: string
}
const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  style,
  placeholder,
  ...rest
}) => {
  return (
    <View style={[tw`bg-white p-2 border-b border-gray-200`, style]}>
      <Input
        accessoryLeft={<Ionicons name="search" size={20} color="#6B7280" />}
        style={tw`ml-2 rounded-full`}
        onChangeText={onSearch}
        placeholder={placeholder || 'Search...'}
        {...rest}
      />
    </View>
  )
}

export default SearchBox
