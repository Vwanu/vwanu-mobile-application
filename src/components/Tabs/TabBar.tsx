import React, { useRef, useEffect } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from 'components/Text'
import tw from 'lib/tailwind'

export interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  const flatListRef = useRef<FlatList>(null)

  // Auto-scroll to center the selected tab
  useEffect(() => {
    if (activeTab && flatListRef.current) {
      const selectedIndex = tabs.findIndex((tab) => tab.id === activeTab)

      if (selectedIndex !== -1 && selectedIndex > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: true,
            viewPosition: 0.5, // Center the selected item
          })
        }, 100)
      }
    }
  }, [activeTab, tabs])

  const renderTab = ({ item }: { item: Tab }) => {
    const isActive = activeTab === item.id
    const isDisabled = item.disabled

    return (
      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => onTabChange(item.id)}
        activeOpacity={0.7}
        style={tw`mr-3 px-5 py-2.5 ${
          isActive
            ? 'border-b-2 border-b-blue-500'
            : 'border-b-2 border-b-transparent'
        } ${isDisabled ? 'opacity-40' : ''}`}
      >
        <View style={tw`flex-row items-center`}>
          {item.icon && (
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isDisabled ? '#9CA3AF' : isActive ? '#3B82F6' : '#6B7280'}
            />
          )}
          <Text
            style={tw`font-medium ${item.icon ? 'ml-2' : ''} ${
              isDisabled
                ? 'text-gray-400'
                : isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={tw`bg-white border-b border-gray-200`}>
      <FlatList
        ref={flatListRef}
        data={tabs}
        renderItem={renderTab}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4 py-2`}
        onScrollToIndexFailed={(info) => {
          // Fallback if scrollToIndex fails
          const wait = new Promise((resolve) => setTimeout(resolve, 500))
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            })
          })
        }}
      />
    </View>
  )
}

export default TabBar
