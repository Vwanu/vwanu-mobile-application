import ProfAvatar from 'components/ProfAvatar'
import useToggle from 'hooks/useToggle'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Popover } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import Button from 'components/Button'
import tw from 'lib/tailwind'
import { ProfileStackParams } from '../../../../types'
import routes from 'navigation/routes'

interface CommunityMemberProps {
  item: any
  isBanned?: boolean
  onBan?: (userId: string) => void
  onUnban?: (userId: string) => void
}
const CommunityMember: React.FC<CommunityMemberProps> = ({
  item,
  isBanned,
  onBan,
  onUnban,
}) => {
  const [isEditing, toggleEditing] = useToggle(false)
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()
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
        onBackdropPress={toggleEditing}
        backdropStyle={tw`bg-black/2`}
      >
        <View style={tw`flex-col items-start`}>
          <Button
            title="View Profile"
            accessoryLeft={<Ionicons name="person" size={15} />}
            appearance="ghost"
            onPress={() => {
              navigation.navigate(routes.PROFILE, { profileId: item.user.id })
              toggleEditing()
            }}
          />
          {!isBanned && onBan && (
            <Button
              title="Ban User"
              accessoryLeft={<Ionicons name="ban" size={15} color="#EF4444" />}
              appearance="ghost"
              onPress={() => {
                onBan(item.user.id)
                toggleEditing()
              }}
            />
          )}
          {isBanned && onUnban && (
            <Button
              title="Unban User"
              accessoryLeft={<Ionicons name="checkmark-circle" size={15} />}
              appearance="ghost"
              onPress={() => {
                onUnban(item.user.id)
                toggleEditing()
              }}
            />
          )}
        </View>
      </Popover>
    </View>
  )
}

export default CommunityMember
