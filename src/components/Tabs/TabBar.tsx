import React, { useRef, useEffect } from 'react'
import { View, FlatList, ViewStyle, StyleProp } from 'react-native'

import tw from 'lib/tailwind'
import TabItem, { Tab } from './Tab'

export type { Tab } from './Tab'
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
  style?: StyleProp<ViewStyle>
  tabStyle?: StyleProp<ViewStyle>
  fullWidth?: boolean
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
  tabStyle,
  fullWidth = false,
}) => {
  const flatListRef = useRef<FlatList>(null)

  // Auto-scroll to center the selected tab (scroll mode only).
  useEffect(() => {
    if (fullWidth) return
    if (activeTab && flatListRef.current) {
      const selectedIndex = tabs.findIndex((tab) => tab.id === activeTab)
      if (selectedIndex !== -1 && selectedIndex > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: true,
            viewPosition: 0.5,
          })
        }, 100)
      }
    }
  }, [activeTab, tabs, fullWidth])

  const renderTab = (item: Tab) => (
    <TabItem
      key={item.id}
      item={item}
      isActive={activeTab === item.id}
      onPress={onTabChange}
      iconOnly={iconOnly}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      underlineColor={underlineColor}
      activeTextColor={activeTextColor}
      disableTextColor={disableTextColor}
      tabStyle={tabStyle}
      fullWidth={fullWidth}
    />
  )

  if (fullWidth) {
    return <View style={[tw`flex-row`, style]}>{tabs.map(renderTab)}</View>
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={tabs}
        renderItem={({ item }) => renderTab(item)}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
        style={style}
        onScrollToIndexFailed={(info) => {
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
