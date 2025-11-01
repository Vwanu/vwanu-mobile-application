import React from 'react'
import { View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import tw from 'lib/tailwind'
import Text from 'components/Text'

interface SearchBoxProps {
  onSearch: (query: string) => void
  style?: object
  placeholder?: string
}
const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  style,
  placeholder,
}) => {
  return (
    <View style={[tw`bg-white p-4 border-b border-gray-200`, style]}>
      <View
        style={tw`flex-row items-center bg-gray-100 rounded-full px-4 py-2`}
      >
        <Ionicons name="search" size={20} color="#6B7280" />
        <Text style={tw`ml-2 text-gray-500`}>{placeholder || 'Search...'}</Text>
      </View>
    </View>
  )
}

export default SearchBox
