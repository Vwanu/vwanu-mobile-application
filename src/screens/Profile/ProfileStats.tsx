import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { useTheme } from 'hooks/useTheme'
import { abbreviateNumber } from 'lib/numberFormat'

interface ProfileHeaderProps {
  user: User
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { isDarkMode } = useTheme()
  return (
    <View style={tw`flex flex-row justify-center items-center mt-4 gap-8`}>
      <View style={tw`justify-center items-center`}>
        <Text style={tw`font-semibold text-lg`}>
          {abbreviateNumber(user?.amountOfFriends || 0)}
        </Text>
        <Text style={tw`font-thin text-sm`}>Friends</Text>
      </View>
      <View
        style={tw`w-[1px] ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-12`}
      />
      <View style={tw`justify-center items-center`}>
        <Text style={tw`font-semibold text-lg`}>
          {abbreviateNumber(user?.amountOfFollowing || 0)}
        </Text>
        <Text style={tw`font-thin text-sm`}>Following</Text>
      </View>
      <View
        style={tw`w-[1px] ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-12`}
      />
      <View style={tw`justify-center items-center`}>
        <Text style={tw`font-semibold text-lg`}>
          {abbreviateNumber(user?.amountOfFollower || 0)}
        </Text>
        <Text style={tw`font-thin text-sm`}>Followers</Text>
      </View>
    </View>
  )
}

export default ProfileHeader
