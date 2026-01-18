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
}
const CommunityMember: React.FC<CommunityMemberProps> = ({
  item,
}: {
  item: any
}) => {
  const [isEditing, toggleEditing] = useToggle(false)
  const navigation = useNavigation<StackNavigationProp<ProfileStackParams>>()
  return (
    <View
      style={tw`flex-row items-center justify-between p-2 border-b border-gray-200`}
    >
      <ProfAvatar
        user={item.user}
        subtitle={item.communityRole.name.toUpperCase()}
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
          {/* <Button title="Report User" accessoryLeft={<Ionicons name="flag" size={15} />}  appearance="ghost"/>
            <Divider style={tw`my-2`} />
            <Button title="Ban User" accessoryLeft={<Ionicons name="ban" size={15} />}  appearance="ghost"/>
            <Button title="Promote to Admin" accessoryLeft={<Ionicons name="star" size={15} />}  appearance="ghost"/>
            <Button title="Promote to Moderator" accessoryLeft={<Ionicons name="star" size={15} />}  appearance="ghost"/> */}
        </View>
      </Popover>
    </View>
  )
}

export default CommunityMember
