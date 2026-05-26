import React from 'react'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { colors } from 'components/ui/tokens'
import tw from 'lib/tailwind'

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
      label: 'Home',
    },
    {
      id: 'people',
      label: 'People',
    },
    {
      id: 'blogs',
      label: 'Blogs',
    },
    {
      id: 'forums',
      label: 'Forum',
    },
  ]

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      activeColor={colors.primaryDeep}
      inactiveColor={colors.mute}
      style={tw`border-b border-gray-200 dark:border-gray-700`}
    />
  )
}

export default TimelineTabs
