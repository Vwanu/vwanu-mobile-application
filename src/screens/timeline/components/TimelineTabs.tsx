import React from 'react'
import TabBar, { Tab } from 'components/Tabs/TabBar'

interface TimelineTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const TimelineTabs: React.FC<TimelineTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Define tabs with icons that change based on active state
  const tabs: Tab[] = [
    {
      id: 'main',
      label: 'Main Feed', // For accessibility, though not displayed
      icon: activeTab === 'main' ? 'home' : 'home-outline',
    },
    {
      id: 'people',
      label: 'People Directory', // For accessibility, though not displayed
      icon: activeTab === 'people' ? 'people' : 'people-outline',
    },
    {
      id: 'blogs',
      label: 'Blogs', // For accessibility, though not displayed
      icon: activeTab === 'blogs' ? 'newspaper' : 'newspaper-outline',
    },
  ]

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      iconOnly={true}
    />
  )
}

export default TimelineTabs
