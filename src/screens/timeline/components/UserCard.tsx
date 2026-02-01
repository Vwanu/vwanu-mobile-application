import { TouchableOpacity } from 'react-native'
import tw from 'lib/tailwind'
import ProfAvatar from 'components/ProfAvatar'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'

import { formatDistanceToNow } from 'date-fns'
interface UserCardProps {
  user: Profile
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const navigation = useNavigation()

  const handleProfileNavigation = () => {
    // Navigate to the user's profile
    const parentNavigation = navigation.getParent()
    if (parentNavigation) {
      // @ts-ignore
      parentNavigation.navigate(routes.ACCOUNT, {
        screen: routes.PROFILE,
        params: { profileId: user.id },
      })
    }
  }

  return (
    <TouchableOpacity
      style={tw`flex-row justify-between py-3 mb-3 bg-white dark:bg-gray-800 rounded-lg`}
      onPress={handleProfileNavigation}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <ProfAvatar
        user={user}
        subtitle={`${
          user.about || 'Not | bio set up'
        } \n Member since ${formatDistanceToNow(
          new Date(user.createdAt || Date.now()),
          { addSuffix: true }
        )}`}
        showOnlineStatus
      />
    </TouchableOpacity>
  )
}

export default UserCard
