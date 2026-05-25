import React, { useRef, useEffect } from 'react'
import { View, FlatList, TouchableOpacity, ViewStyle } from 'react-native'
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
  iconOnly?: boolean
  activeTextColor?: string
  disableTextColor?: string
  activeColor?: string
  inactiveColor?: string
  underlineColor?: string
  style?: ViewStyle | ViewStyle[]
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  iconOnly = false,
  disableTextColor,
  activeTextColor,
  activeColor = '#3B82F6',
  inactiveColor = '#6B7280',
  underlineColor,
  style,
}) => {
  const activeBorder = underlineColor ?? activeColor
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
        style={[
          tw`mr-3 px-5 py-2.5 ${isDisabled ? 'opacity-40' : ''}`,
          {
            borderBottomWidth: 2,
            borderBottomColor: isActive ? activeBorder : 'transparent',
          },
        ]}
      >
        <View style={tw`flex-row items-center`}>
          {item.icon && (
            <Ionicons
              name={item.icon as any}
              size={iconOnly ? 24 : 20}
              color={
                isDisabled ? '#9CA3AF' : isActive ? activeColor : inactiveColor
              }
            />
          )}
          {!iconOnly && (
            <Text
              style={tw`font-medium ${item.icon ? 'ml-2' : ''} ${
                isDisabled
                  ? disableTextColor || 'text-gray-400'
                  : isActive
                  ? activeTextColor || 'text-primary'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {item.label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={tabs}
        renderItem={renderTab}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4 `}
        style={style}
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
