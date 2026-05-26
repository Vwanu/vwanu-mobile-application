import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import ProfAvatar from 'components/ProfAvatar'
import { PrivacyNoticeField } from 'components/form'
import { colors } from 'components/ui/tokens'

interface Props {
  user: User
}

const PostUserRow: React.FC<Props> = ({ user }) => (
  <View
    style={tw`flex-row items-center justify-between px-4 py-2 border-t border-b border-t-warm-border border-b-warm-border`}
  >
    <View style={tw`flex-1 min-w-0 mr-3 overflow-hidden`}>
      <ProfAvatar
        user={user}
        subtitle="Share your thoughts with the community"
      />
    </View>
    <View
      style={[tw`p-2 rounded-full border`, { borderColor: colors.warmBorder }]}
    >
      <PrivacyNoticeField
        displayLong
        name="privacyType"
        canEdit={true}
        isEditing={false}
      />
    </View>
  </View>
)

export default PostUserRow
