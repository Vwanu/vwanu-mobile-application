import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native'
import type { Suggestion } from 'react-native-controlled-mentions'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import useMentionSuggestions from 'hooks/useMentions'

interface SuggestionListProps {
  keyword?: string
  onSelect: (suggestion: Suggestion) => void
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  keyword,
  onSelect,
}) => {
  const { suggestions, isLoading } = useMentionSuggestions(keyword)

  if (keyword === undefined) return null

  if (isLoading && suggestions.length === 0) {
    return (
      <View
        style={[
          tw`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3`,
          {
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            zIndex: 999,
          },
        ]}
      >
        <ActivityIndicator size="small" color={tw.color('primary')} />
      </View>
    )
  }

  if (suggestions.length === 0) return null

  return (
    <View
      style={[
        tw`bg-white dark:bg-gray-800 rounded-lg shadow-md`,
        {
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          zIndex: 999,
        },
      ]}
    >
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        style={tw`max-h-40`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`flex-row items-center px-3 py-2`}
            onPress={() =>
              onSelect({
                id: item.id,
                name: `${item.firstName} ${item.lastName}`,
              })
            }
          >
            <Text style={tw`text-sm text-gray-800 dark:text-gray-200`}>
              {item.firstName} {item.lastName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default SuggestionList
