import React, { useEffect, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { View, ImageBackground, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import AvatarGroup from 'components/AvatarGroups'
import { CommunityStackParams, CommunityInterface } from '../../../../types'
import LongText from 'components/LongText'
import Button from 'components/Button'
import { Ionicons } from '@expo/vector-icons'
import {
  useJoinCommunityMutation,
  useUpdateCommunityInvitationMutation,
} from 'store/communities-api-slice'
import { ActivityIndicator } from 'react-native-paper'

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

  const [updateCommunity, { isLoading: loadingUpdated, error: errorUpdating }] =
    useUpdateCommunityInvitationMutation()
  const [joinCommunity, { isLoading: loadingJoin, error: joinError }] =
    useJoinCommunityMutation()
  const handlePress = () => {
    if (community.isCreateCard) {
      // navigation.navigate('CreateCommunity')
      console.log('Nav')
    } else {
      if (onCommunityPress) {
        onCommunityPress()
        return
      }
      navigation.navigate('CommunityDetail', {
        communityId: community.id.toString(),
      })
    }
  }

  const handleJoinCommunity = (communityId: string) => {
    joinCommunity(communityId)
  }
  const handleUpdateInvitation = (invitationId: string, response: boolean) => {
    updateCommunity({ invitationId, communityId: community.id, response })
  }
  const amountOfMembers = community?.numMembers + community?.numAdmins

  const loading = loadingJoin || loadingUpdated
  const error = joinError || errorUpdating

  useEffect(() => {
    if (error) onError?.(error)
  }, [error])

  const computeStyle = useMemo(() => {
    return size === 'small'
      ? tw`rounded-2xl overflow-hidden h-48 w-48`
      : size === 'extra-small'
      ? tw`rounded-2xl overflow-hidden h-32 w-48`
      : tw`rounded-3xl overflow-hidden h-80 w-full`
  }, [size, style])

  const computeTitleStyle = useMemo(() => {
    return size === 'small'
      ? tw`text-white text-base font-bold mb-2 leading-5`
      : size === 'extra-small'
      ? tw`text-white font-bold my-2 leading-4`
      : tw`text-white text-2xl font-bold mb-2 leading-6`
  }, [size])

  return (
    <TouchableOpacity style={[computeStyle, style]} onPress={handlePress}>
      <ImageBackground
        source={{ uri: community?.profilePicture }}
        style={tw`w-full h-full`}
        resizeMode="cover"
      >
        {loading && <ActivityIndicator animating={loading} />}
        <View
          style={tw`bg-black bg-opacity-50 h-full flex justify-between p-3`}
        >
          {displayDetails && (
            <View style={tw`pt-10`}>
              <View style={tw` flex-row items-center justify-between`}>
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

          {/* Bottom section with community info */}
          <View>
            <LongText
              text={community?.name}
              textStyles={computeTitleStyle}
              maxLength={
                size == 'extra-small' ? 50 : size == 'small' ? 20 : undefined
              }
              showShowMoreText={size === 'extra-small' ? false : true}
            />

            {size !== 'extra-small' ? (
              <LongText
                text={community.description}
                maxLength={size === 'small' ? 10 : 150}
                showMoreText=">>"
                showLessText="Show less"
                style={tw`text-white -mt-5`}
              />
            ) : null}

            <View style={tw`flex-row items-center justify-between mt-5`}>
              <View style={tw`flex-row items-center`}>
                <AvatarGroup avatars={community.members || []} size={25} />
                {amountOfMembers && (
                  <Text style={tw`text-white text-xs ml-2`}>
                    {amountOfMembers < 100
                      ? amountOfMembers
                      : new Intl.NumberFormat('en-US', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(amountOfMembers) + '+'}{' '}
                    member{amountOfMembers > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              {community.isMember ? (
                <View style={tw`bg-white bg-opacity-90 px-3 py-1 rounded-full`}>
                  <Text style={tw`text-black font-semibold text-xs`}>
                    {community.isMember.role.toUpperCase()}
                  </Text>
                </View>
              ) : (
                <View style={tw``}>
                  {
                    // has pending invitation  show you have pending invitation  show accept or reject
                    community.pendingInvitation ? (
                      <View style={tw` gap-2`}>
                        <TouchableOpacity
                          onPress={() => {
                            community.pendingInvitation &&
                              handleUpdateInvitation(
                                community.pendingInvitation?.id,
                                true
                              )
                          }}
                          style={tw`bg-white border-b-2 border-l-2 border-r-2 border-b-primary border-r-primary bg-opacity-90 border-l-primary bg-opacity-90 px-3 py-1 rounded-full`}
                        >
                          <Text style={tw`text-black font-semibold text-xs`}>
                            Accept Invitation{' '}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            community.pendingInvitation &&
                              handleUpdateInvitation(
                                community.pendingInvitation?.id,
                                false
                              )
                          }}
                          style={tw`bg-white border-b-2 border-l-2 border-r-2  border-b-red-500 border-l-red-500 border-r-red-500 bg-opacity-90 px-3 py-1 rounded-full`}
                        >
                          <Text style={tw`text-black font-semibold text-xs`}>
                            Reject Invitation
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        {size != 'extra-small' ? (
                          <TouchableOpacity
                            disabled={community.pendingJoinRequest}
                            onPress={() => {
                              handleJoinCommunity(community.id)
                            }}
                          >
                            <Text
                              style={tw`text-black font-semibold text-xs bg-white bg-opacity-90 px-3 py-1 rounded-full`}
                            >
                              {community.pendingJoinRequest
                                ? 'Pending Request'
                                : 'Join'}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </>
                    )
                  }
                </View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default CommunityGridCard
