import React from 'react'
import { View, ImageBackground, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import AvatarGroup from 'components/AvatarGroups'
import { CommunityStackParams, CommunityInterface } from '../../../../types'
import { cdnImageUrl } from 'lib/cdnImageUrl'

type NavigationProp = StackNavigationProp<CommunityStackParams, 'Communities'>

interface Props {
  community: CommunityInterface
  size?: 'small' | 'medium' | 'large'
}

const FeaturedCommunityCard: React.FC<Props> = ({
  community,
  size = 'medium',
}) => {
  const navigation = useNavigation<NavigationProp>()

  const handlePress = () => {
    if (community.isCreateCard) {
      navigation.navigate('CreateCommunity')
    } else {
      navigation.navigate('CommunityDetail', {
        communityId: community.id.toString(),
      })
    }
  }

  return (
    <TouchableOpacity
      style={tw`rounded-3xl overflow-hidden h-80 w-full`}
      onPress={handlePress}
    >
      <ImageBackground
        source={{
          uri: cdnImageUrl(community.profilePicture, {
            width: 800,
            height: 800,
          }),
        }}
        style={tw`w-full h-full`}
        resizeMode="cover"
      >
        <View
          style={tw`bg-black bg-opacity-40 h-full flex justify-between p-4`}
        >
          {/* Interest tags at the top */}
          <View style={tw`flex-row flex-wrap`}>
            {community.interests?.slice(0, 3).map((interest) => (
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
          <View style={tw`flex-col`}>
            <Text
              category="h4"
              style={tw`text-white font-bold text-2xl mb-2 leading-7`}
              numberOfLines={2}
            >
              {community.name}
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
              {/* Member avatars and count */}
              <View style={tw`flex-row items-center`}>
                <AvatarGroup avatars={community.members || []} size={35} />

                {community.numMembers && (
                  <Text style={tw`text-white text-sm ml-3 opacity-90`}>
                    {(
                      community.numMembers + community.numAdmins || 0
                    ).toLocaleString()}
                  </Text>
                )}
              </View>

              {/* Join button */}
              <TouchableOpacity
                style={tw`bg-white bg-opacity-90 px-6 py-3 rounded-full`}
              >
                <Text style={tw`text-black font-semibold text-sm`}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default FeaturedCommunityCard
