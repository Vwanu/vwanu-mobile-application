import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'
import { useFetchCommunityQuery } from 'store/communities-api-slice'

interface Props {
  communityId?: string
}

const PostingInPill: React.FC<Props> = ({ communityId }) => {
  const { data: community } = useFetchCommunityQuery(communityId!, {
    skip: !communityId,
  })
  const label = community?.name ?? 'Feed'
  return (
    <View style={tw`px-4 pb-1`}>
      <View
        style={[
          tw`flex-row items-center self-start px-3 py-1.5 rounded-full`,
          { backgroundColor: colors.primarySoft },
        ]}
      >
        <Ionicons
          name={communityId ? 'people-outline' : 'globe-outline'}
          size={12}
          color={colors.primaryDeep}
        />
        <Text
          style={[
            tw`ml-1.5 font-poppins-medium text-xs`,
            { color: colors.primaryDeep },
          ]}
        >
          Posting in {label}
        </Text>
      </View>
    </View>
  )
}

export default PostingInPill
