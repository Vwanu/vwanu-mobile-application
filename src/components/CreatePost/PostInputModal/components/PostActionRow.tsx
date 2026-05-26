import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import ModalActionPill from 'components/ui/ModalActionPill'
import { colors } from 'components/ui/tokens'

interface Props {
  onAddMedia: () => void
  onLocation?: () => void
  onTagPeople?: () => void
}

const PostActionRow: React.FC<Props> = ({
  onAddMedia,
  onLocation,
  onTagPeople,
}) => (
  <View
    style={[
      tw`flex-row h-35 items-start pt-3 px-2 border-t`,
      { borderColor: colors.warmBorder },
    ]}
  >
    <ModalActionPill
      icon="image-multiple"
      iconSet="material-community"
      label="Add Media"
      onPress={onAddMedia}
    />
    <ModalActionPill
      icon="map-marker"
      iconSet="material-community"
      label="Location"
      onPress={onLocation}
    />
    <ModalActionPill
      icon="account-group"
      iconSet="material-community"
      label="Tag People"
      onPress={onTagPeople}
    />
  </View>
)

export default PostActionRow
