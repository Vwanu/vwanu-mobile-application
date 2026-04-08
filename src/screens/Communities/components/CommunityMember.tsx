import React, { useState } from 'react'
import ProfAvatar from 'components/ProfAvatar'
import useToggle from 'hooks/useToggle'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Popover } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import Button from 'components/Button'
import Text from 'components/Text'
import tw from 'lib/tailwind'
import { ProfileStackParams } from '../../../../types'
import routes from 'navigation/routes'

const BAN_DURATIONS = [
  { label: '1 Week', value: '1_week' },
  { label: '1 Month', value: '1_month' },
  { label: '3 Months', value: '3_months' },
  { label: 'Forever', value: 'forever' },
]

interface CommunityMemberProps {
  item: any
  isBanned?: boolean
  onBan?: (userId: string, duration: string) => void
  onUnban?: (userId: string) => void
}
const CommunityMember: React.FC<CommunityMemberProps> = ({
  item,
  isBanned,
  onBan,
  onUnban,
}) => {
  const [isEditing, toggleEditing] = useToggle(false)
  const [showBanOptions, setShowBanOptions] = useState(false)
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()

  const closePopover = () => {
    toggleEditing()
    setShowBanOptions(false)
  }

  return (
    <View
      style={tw`flex-row items-center justify-between p-2 border-b border-gray-200`}
    >
      <ProfAvatar
        user={item.user}
        subtitle={isBanned ? 'BANNED' : item.communityRole.name.toUpperCase()}
        size={40}
      />
      <Popover
        visible={isEditing}
        anchor={() => (
          <TouchableOpacity onPress={toggleEditing}>
            <Ionicons name="ellipsis-horizontal-outline" size={15} />
          </TouchableOpacity>
        )}
        onBackdropPress={closePopover}
        backdropStyle={tw`bg-black/2`}
      >
        <View style={tw`flex-col items-start`}>
          {showBanOptions ? (
            <>
              <Text
                style={tw`px-3 pt-2 pb-1 text-sm font-semibold text-gray-500`}
              >
                Ban Duration
              </Text>
              {BAN_DURATIONS.map((option) => (
                <Button
                  key={option.value}
                  title={option.label}
                  accessoryLeft={
                    <Ionicons
                      name={option.value === 'forever' ? 'ban' : 'time-outline'}
                      size={15}
                      color={option.value === 'forever' ? '#EF4444' : undefined}
                    />
                  }
                  appearance="ghost"
                  onPress={() => {
                    onBan?.(item.user.id, option.value)
                    closePopover()
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Button
                title="View Profile"
                accessoryLeft={<Ionicons name="person" size={15} />}
                appearance="ghost"
                onPress={() => {
                  navigation.navigate(routes.PROFILE, {
                    profileId: item.user.id,
                  })
                  closePopover()
                }}
              />
              {!isBanned && onBan && (
                <Button
                  title="Ban User"
                  accessoryLeft={
                    <Ionicons name="ban" size={15} color="#EF4444" />
                  }
                  appearance="ghost"
                  onPress={() => setShowBanOptions(true)}
                />
              )}
              {isBanned && onUnban && (
                <Button
                  title="Unban User"
                  accessoryLeft={<Ionicons name="checkmark-circle" size={15} />}
                  appearance="ghost"
                  onPress={() => {
                    onUnban(item.user.id)
                    closePopover()
                  }}
                />
              )}
            </>
          )}
        </View>
      </Popover>
    </View>
  )
}

export default CommunityMember
