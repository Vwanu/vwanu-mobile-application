import React from 'react'
import { View, TextStyle, StyleProp } from 'react-native'

import tw from 'lib/tailwind'
import LongText from 'components/LongText'
import { CommunityInterface } from '../../../../../../types'

interface Props {
  community: CommunityInterface
  titleStyle: StyleProp<TextStyle>
  titleMaxLength?: number
  showTitleShowMore: boolean
  showDescription: boolean
  descriptionMaxLength?: number
  children?: React.ReactNode
}

const CommunityCardBody: React.FC<Props> = ({
  community,
  titleStyle,
  titleMaxLength,
  showTitleShowMore,
  showDescription,
  descriptionMaxLength,
  children,
}) => (
  <View>
    <LongText
      text={community?.name}
      textStyles={[tw`text-white font-syne-bold`, titleStyle]}
      maxLength={titleMaxLength}
      showShowMoreText={showTitleShowMore}
    />
    {showDescription && community?.description ? (
      <LongText
        text={community.description}
        maxLength={descriptionMaxLength}
        showShowMoreText={false}
        textStyles={tw`text-white mt-1 font-bold`}
      />
    ) : null}
    {children}
  </View>
)

export default CommunityCardBody
