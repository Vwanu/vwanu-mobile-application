import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import tw from 'lib/tailwind'
import useToggle from 'hooks/useToggle'
import { Popover } from '@ui-kitten/components'

import Text from 'components/Text'
import { Ionicons } from '@expo/vector-icons'

interface Item {
  id: string
  name: string
  icon?: React.ReactNode | string
}

interface FilterProps {
  style?: object
  items: Item[]
  onSelect: (item: Item) => void
}
const Filter: React.FC<FilterProps> = ({ style, items, onSelect }) => {
  const [isFiltering, toggleFiltering] = useToggle(false)

  const handleSelect = (item: Item) => {
    onSelect(item)
    toggleFiltering()
  }
  return (
    <Popover
      visible={isFiltering}
      anchor={() => (
        <TouchableOpacity onPress={toggleFiltering}>
          <Ionicons name="filter-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
      onBackdropPress={toggleFiltering}
      backdropStyle={tw`bg-black/2`}
    >
      <View style={tw`p-2`}>
        {items.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelect(item)}>
            {item.icon && typeof item.icon === 'string' ? (
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color="#6B7280"
              />
            ) : (
              (item.icon as React.ReactNode)
            )}
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Popover>
  )
}

export default Filter
