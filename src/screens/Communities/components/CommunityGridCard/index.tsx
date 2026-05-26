import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native'

import tw from 'lib/tailwind'
import { CommunityStackParams, CommunityInterface } from '../../../../../types'
import { SIZE_VARIANTS, CardSize } from './variants'
import { useCommunityMembership } from './hooks/useCommunityMembership'
import CommunityCardMedia from './components/CommunityCardMedia'
import CommunityInterestPills from './components/CommunityInterestPills'
import CommunityDetailHeaderButtons from './components/CommunityDetailHeaderButtons'
import CommunityCardBody from './components/CommunityCardBody'
import CommunityMembersStat from './components/CommunityMembersStat'
import CommunityMembershipActions from './components/CommunityMembershipActions'

type NavigationProp = StackNavigationProp<CommunityStackParams, 'Communities'>

interface Props {
  community: CommunityInterface
  size?: CardSize
  onCommunityPress?: () => void
  style?: StyleProp<ViewStyle>
  displayDetails?: boolean
  onError?: (e: any) => void
}

const CommunityGridCard: React.FC<Props> = ({
  displayDetails = false,
  community,
  size = 'small',
  onCommunityPress,
  style,
  onError,
}) => {
  const navigation = useNavigation<NavigationProp>()
  const { loading } = useCommunityMembership({
    communityId: community?.id,
    onError,
  })

  const variant = SIZE_VARIANTS[size]

  const handlePress = () => {
    if (onCommunityPress) {
      onCommunityPress()
      return
    }
    navigation.navigate('CommunityDetail', {
      communityId: community.id.toString(),
    })
  }

  if (!community) return null

  return (
    <TouchableOpacity style={[variant.card, style]} onPress={handlePress}>
      <CommunityCardMedia
        profilePicture={community?.profilePicture}
        loading={loading}
      >
        {displayDetails ? <CommunityDetailHeaderButtons /> : <View />}

        <CommunityInterestPills
          interests={community?.interests}
          containerStyle={displayDetails ? tw`pt-10` : undefined}
        />

        <CommunityCardBody
          community={community}
          titleStyle={variant.title}
          titleMaxLength={variant.titleMaxLength}
          showTitleShowMore={variant.showTitleShowMore}
          showDescription={variant.showDescription}
          descriptionMaxLength={variant.descriptionMaxLength}
        >
          <View style={tw`flex-row items-center justify-between mt-5`}>
            <CommunityMembersStat community={community} />
            <CommunityMembershipActions
              community={community}
              hideJoin={!variant.showJoin}
              onError={onError}
            />
          </View>
        </CommunityCardBody>
      </CommunityCardMedia>
    </TouchableOpacity>
  )
}

export default CommunityGridCard
