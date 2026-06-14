import { View, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ScreenHeader from 'components/ScreenHeader'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { colors } from 'components/ui/tokens'

interface NotificationListHeaderProps {
  unreadCount: number
  showUnreadOnly: boolean
  setShowUnreadOnly: (showUnreadOnly: boolean) => void
  handleMarkAllAsRead: () => void
}

const NotificationListHeader: React.FC<NotificationListHeaderProps> = ({
  unreadCount,
  showUnreadOnly,
  setShowUnreadOnly,
  handleMarkAllAsRead,
}) => {
  const markAllRead = (
    <TouchableOpacity
      onPress={handleMarkAllAsRead}
      disabled={unreadCount === 0}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
    >
      <Text
        style={tw`font-poppins-semibold text-sm ${
          unreadCount > 0 ? 'text-primary-deep' : 'text-warm-dim'
        }`}
      >
        Mark all read
      </Text>
    </TouchableOpacity>
  )

  const unreadBadge =
    unreadCount > 0 ? (
      <View style={tw`px-2 rounded-full bg-coral`}>
        <Text style={tw`font-poppins-bold text-[10px] text-white`}>
          {unreadCount > 9 ? '9+' : String(unreadCount)}
        </Text>
      </View>
    ) : null

  const filterTabs: Tab[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', badge: unreadBadge },
  ]

  return (
    <View>
      <ScreenHeader
        title="Notifications"
        subtitle="Stay up to date"
        rightAction={markAllRead}
        containerStyle={tw`border-t border-warm-border`}
      />

      <TabBar
        fullWidth
        tabs={filterTabs}
        activeTab={showUnreadOnly ? 'unread' : 'all'}
        onTabChange={(id) => setShowUnreadOnly(id === 'unread')}
        activeColor={colors.primaryDeep}
        inactiveColor={colors.mute}
        activeTextColor="text-primary-deep"
        style={tw`border-b border-warm-border mb-2`}
      />
    </View>
  )
}

export default NotificationListHeader
