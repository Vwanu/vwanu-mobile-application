import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import { NotificationInterface } from '../../../../types'
import { isNotificationRead } from '../lib/isNotificationRead'

interface NotificationItemProps {
  notification: NotificationInterface
  onPress: (notification: NotificationInterface) => void
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

const ICON_FOR_TYPE: Record<string, IoniconName> = {
  like: 'heart',
  comment: 'chatbubble',
  follow: 'person-add',
  community_invite: 'people-circle',
  community_join_request: 'people-circle',
  community_post: 'chatbubbles',
  profile_visit: 'eye',
}

const iconForType = (type?: string): IoniconName =>
  (type && ICON_FOR_TYPE[type]) || 'notifications'

const TypeBadge: React.FC<{ icon: IoniconName }> = ({ icon }) => (
  <View
    style={tw`w-5 h-5 rounded-full bg-primary-deep items-center justify-center border-2 border-warm-surface`}
  >
    <Ionicons name={icon} size={10} color="#FFFFFF" />
  </View>
)

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const user = notification.fromUser
  const unread = !isNotificationRead(notification)

  const handlePress = () => onPress(notification)

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={tw`mx-4 my-1 p-3 rounded-card border border-warm-border flex-row items-start ${
        unread ? 'bg-primary-soft' : 'bg-warm-surface'
      }`}
    >
      {/* Avatar + name + message via ProfAvatar; pointerEvents=none lets the outer card capture the tap */}
      <View style={tw`flex-1`} pointerEvents="none">
        <ProfAvatar
          user={user as User}
          size={44}
          subtitle={notification.message}
          disableDefaultNavigation
          badge={<TypeBadge icon={iconForType(notification.type)} />}
          titleStyles={tw`font-poppins-semibold text-sm text-ink`}
          subtitleParams={{
            textStyles: tw`font-poppins text-[13px] leading-[18px] ${
              unread ? 'text-soft' : 'text-mute'
            }`,
          }}
        />
      </View>

      <View style={tw`items-end ml-2`}>
        <Text style={tw`font-poppins text-[11px] text-mute mt-1`}>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </Text>
      </View>

      {unread && (
        <View
          style={tw`absolute top-2 right-2 w-2 h-2 rounded-full bg-coral`}
        />
      )}
    </TouchableOpacity>
  )
}

export default NotificationItem
