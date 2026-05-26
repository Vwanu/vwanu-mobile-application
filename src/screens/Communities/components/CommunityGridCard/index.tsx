import React, { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { View, ImageBackground, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import LongText from 'components/LongText'
import Button from 'components/Button'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'
import { cdnImageUrl } from 'lib/cdnImageUrl'

import { CommunityStackParams, CommunityInterface } from '../../../../../types'
import CommunityMembershipActions from './components/CommunityMembershipActions'
import CommunityMembersStat from './components/CommunityMembersStat'
import { useCommunityMembership } from './hooks/useCommunityMembership'

type NavigationProp = StackNavigationProp<CommunityStackParams, 'Communities'>

interface Props {
  community: CommunityInterface
  size?: 'small' | 'large' | 'extra-small'
  onCommunityPress?: () => void
  style?: any
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

  const handlePress = () => {
    if (community.isCreateCard) {
      console.log('Nav')
      return
    }
    if (onCommunityPress) {
      onCommunityPress()
      return
    }
    navigation.navigate('CommunityDetail', {
      communityId: community.id.toString(),
    })
  }

  const computeStyle = useMemo(() => {
    return size === 'small'
      ? tw`rounded-2xl overflow-hidden h-48 w-48`
      : size === 'extra-small'
      ? tw`rounded-2xl overflow-hidden h-32 w-48`
      : tw`rounded-3xl overflow-hidden h-80 w-full`
  }, [size])

  const computeTitleStyle = useMemo(() => {
    return size === 'small'
      ? tw`text-white text-base font-bold mb-2 leading-5`
      : size === 'extra-small'
      ? tw`text-white font-bold my-2 leading-4`
      : tw`text-white text-2xl font-bold mb-2 leading-6`
  }, [size])

  if (!community) return null

  return (
    <TouchableOpacity style={[computeStyle, style]} onPress={handlePress}>
      <ImageBackground
        source={{
          uri: cdnImageUrl(community?.profilePicture, {
            width: 600,
            height: 600,
          }),
        }}
        style={tw`w-full h-full`}
        resizeMode="cover"
      >
        {loading && <ActivityIndicator animating={loading} />}
        <View
          style={tw`bg-black bg-opacity-50 h-full flex justify-between p-3`}
        >
          {displayDetails && (
            <View style={tw`pt-10`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Button
                  accessoryRight={() => (
                    <Ionicons name="arrow-back" size={24} color="white" />
                  )}
                  onPress={() => navigation.goBack()}
                  appearance="ghost"
                />
                <Button
                  accessoryRight={() => (
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color="white"
                    />
                  )}
                  onPress={() => navigation.goBack()}
                  appearance="ghost"
                />
              </View>
            </View>
          )}

          <View style={tw`flex-row flex-wrap ${displayDetails ? 'pt-10' : ''}`}>
            {community?.interests?.slice(0, 3).map((interest) => (
              <View
                key={interest.id}
                style={tw`bg-white bg-opacity-80 px-3 py-1 rounded-full mr-2 mb-2`}
              >
                <Text style={tw`text-black text-xs font-medium`}>
                  {interest.name}
                </Text>
              </View>
            ))}
          </View>

          <View>
            <LongText
              text={community?.name}
              textStyles={computeTitleStyle}
              maxLength={
                size === 'extra-small' ? 50 : size === 'small' ? 20 : undefined
              }
              showShowMoreText={size !== 'extra-small'}
            />

            {size !== 'extra-small' && community?.description ? (
              <LongText
                text={community.description}
                maxLength={size === 'small' ? 10 : 150}
                showMoreText=">>"
                showLessText="Show less"
                style={tw`text-white -mt-5`}
              />
            ) : null}

            <View style={tw`flex-row items-center justify-between mt-5`}>
              <CommunityMembersStat community={community} />
              <CommunityMembershipActions
                community={community}
                hideJoin={size === 'extra-small'}
                onError={onError}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default CommunityGridCard
