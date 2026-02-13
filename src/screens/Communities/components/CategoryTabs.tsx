import React from 'react'

import { Interest } from '../../../store/interests'
import TabBar, { Tab } from '../../../components/Tabs/TabBar'
import { ViewStyle } from 'react-native'

interface CategoryTabsProps {
  interests: Interest[]
  selectedInterest: Interest | null
  onInterestChange: (interest: Interest) => void
  style: ViewStyle
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  interests,
  selectedInterest,
  onInterestChange,
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
    <TabBar
      tabs={tabs}
      activeTab={selectedInterest?.id || ''}
      onTabChange={handleTabChange}
    />
  )
}

export default CategoryTabs
