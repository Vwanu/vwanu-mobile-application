import React, { useState } from 'react'
import { View } from 'react-native'
import tw from 'lib/tailwind'
import TabBar, { Tab } from './TabBar'

export interface TabContent extends Tab {
  component: React.ReactNode
  show: boolean
}

interface TabsProps {
  tabs: TabContent[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || ''
  )

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)

  return (
    <View style={tw`flex-1`}>
      <TabBar
        tabs={tabs
          .filter((tab) => tab.show)
          .map(({ id, label, icon, disabled }) => ({
            id,
            label,
            icon,
            disabled,
          }))}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <View style={tw`flex-1`}>{activeTabContent?.component}</View>
    </View>
  )
}

export default Tabs
