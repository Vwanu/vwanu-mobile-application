import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import tw from 'lib/tailwind'
import ProfAvatar from 'components/ProfAvatar'
import Text from 'components/Text'
import { MockUser } from 'data/mockUsers'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'
import { Ionicons } from '@expo/vector-icons'

interface UserCardProps {
  user: MockUser
  onFollowToggle: (userId: string, isFollowing: boolean) => void
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollowToggle }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const handleFollowToggle = async () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const newFollowingState = !isFollowing
      setIsFollowing(newFollowingState)
      onFollowToggle(user.id, newFollowingState)
      setIsLoading(false)
    }, 300)
  }

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
      style={tw`flex-row items-center justify-between py-3 mb-3 bg-white dark:bg-gray-800 rounded-lg`}
      onPress={handleProfileNavigation}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <ProfAvatar
        size={48}
        source={user.profilePicture || ''}
        name={`${user.firstName} ${user.lastName}`}
        subtitle={`${user.bio || ''}\n member since 5 years`}
      />

      {/* Soon to be popover button allow to follow , see profile, message , send friend request , or unfriend */}
      <TouchableOpacity
        onPress={handleFollowToggle}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={tw.color('primary')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default UserCard
