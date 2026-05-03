import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { abbreviateNumber } from 'lib/numberFormat'

interface ProfileHeaderProps {
  user: User
}

const ProfileHeaderStat = ({
  label,
  value,
  withBorder,
}: {
  label: string
  value: number
  withBorder: boolean
}) => {
  return (
    <View
      style={tw`flex-1 items-center py-3 ${
        withBorder ? 'border-r border-warm-border' : ''
      }`}
    >
      <Text style={tw`font-poppins-bold text-[17px] text-ink leading-5`}>
        {abbreviateNumber(value || 0)}
      </Text>
      <Text
        style={tw`text-[10px] font-poppins-semibold text-mute mt-0.5 uppercase tracking-wide`}
      >
        {label}
      </Text>
    </View>
  )
}

const ProfileHeaderStats: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <View style={tw`flex-row border-t border-warm-border`}>
      <ProfileHeaderStat
        label="Friends"
        value={user?.amountOfFriends}
        withBorder
      />
      <ProfileHeaderStat
        label="Followings"
        value={user?.amountOfFollowing}
        withBorder
      />
      <ProfileHeaderStat
        label="Followers"
        value={user?.amountOfFollower}
        withBorder={false}
      />
    </View>
  )
}

export default ProfileHeaderStats
