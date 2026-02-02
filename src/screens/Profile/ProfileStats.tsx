import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { useTheme } from 'hooks/useTheme'
import { abbreviateNumber } from 'lib/numberFormat'

interface ProfileHeaderProps {
  user: User
}

const Separator = () => {
  const { isDarkMode } = useTheme()
  return (
    <View style={tw`w-[1.5px] ${isDarkMode ? 'bg-white' : 'bg-black'} h-12`} />
  )
}
const ProfileHeaderStat = ({
  label,
  value,
}: {
  label: string
  value: number
}) => {
  return (
    <View style={tw`justify-center items-center`}>
      <Text style={[tw`font-semibold text-lg font-poppins-semibold`]}>
        {abbreviateNumber(value)}
      </Text>
      <Text style={[tw`text-sm font-poppins-medium`]}>{label}</Text>
    </View>
  )
}
const ProfileHeaderStats: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <View style={tw`flex flex-row justify-center items-center mt-4 gap-8`}>
      <ProfileHeaderStat label="Friends" value={user?.amountOfFriends || 0} />
      <Separator />
      <ProfileHeaderStat
        label="Followings"
        value={user?.amountOfFollowing || 0}
      />
      <Separator />
      <ProfileHeaderStat
        label="Followers"
        value={user?.amountOfFollower || 0}
      />
    </View>
  )
}

export default ProfileHeaderStats
