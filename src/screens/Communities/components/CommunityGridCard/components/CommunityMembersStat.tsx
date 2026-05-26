import React from 'react'
import { View, TextStyle, StyleProp } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import AvatarGroup from 'components/AvatarGroups'
import { CommunityInterface } from '../../../../../../types'

interface Props {
  community: CommunityInterface
  avatarSize?: number
  textStyle?: StyleProp<TextStyle>
}

const formatCount = (n: number) =>
  n < 100
    ? n
    : new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(n) + '+'

const CommunityMembersStat: React.FC<Props> = ({
  community,
  avatarSize = 25,
  textStyle,
}) => {
  const total = (community?.numMembers ?? 0) + (community?.numAdmins ?? 0)

  return (
    <View style={tw`flex-row items-center`}>
      {community?.members && (
        <AvatarGroup avatars={community.members} size={avatarSize} />
      )}
      {total > 0 && (
        <Text style={[tw`text-white text-xs ml-2`, textStyle]}>
          {formatCount(total)} member{total > 1 ? 's' : ''}
        </Text>
      )}
    </View>
  )
}

export default CommunityMembersStat
