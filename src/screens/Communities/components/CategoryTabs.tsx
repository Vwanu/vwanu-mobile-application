import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Interest } from '../../../store/interests'
import TabBar, { Tab } from '../../../components/Tabs/TabBar'
import { ViewStyle } from 'react-native'
import tw from '../../../lib/tailwind'

interface CategoryTabsProps {
  interests: Interest[]
  selectedInterest: Interest | null
  onInterestChange: (interest: Interest) => void
  onClear?: () => void
  style?: ViewStyle
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  interests,
  selectedInterest,
  onInterestChange,
  onClear,
}) => {
  if (interests.length === 0) {
    return null
  }

  // Convert interests to Tab format
  const tabs: Tab[] = interests.map((interest) => ({
    id: interest.id,
    label: interest.name,
  }))

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const selectedInterestItem = interests.find(
      (interest) => interest.id === tabId
    )
    if (selectedInterestItem) {
      onInterestChange(selectedInterestItem)
    }
  }

  return (
    <View style={tw`flex-row items-center`}>
      <View style={tw`flex-1`}>
        <TabBar
          tabs={tabs}
          activeTab={selectedInterest?.id || ''}
          onTabChange={handleTabChange}
        />
      </View>
      {selectedInterest && onClear && (
        <TouchableOpacity onPress={onClear} style={tw`px-3 py-2`}>
          <Ionicons
            name="close-circle"
            size={20}
            color={tw.color('gray-400')}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default CategoryTabs
