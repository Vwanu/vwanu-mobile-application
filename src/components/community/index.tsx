import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, ImageBackground, TouchableOpacity } from 'react-native'

import Text from '../Text'
import tw from '../../lib/tailwind'
import routes from '../../navigation/routes'

export interface CommunityInterface {
  id: number
  name: string
  createdAt: string
  backgroundImage: string
  interests: Interest[]
  memberCount?: number
  isCreateCard?: boolean
  isMember?: Member
}

const Community: React.FC<CommunityInterface> = (props) => {
  const navigation = useNavigation<{}>()

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate(routes.COMMUNITY, {
      screen: 'CommunityDetail',
      params: { communityId: props.id.toString() },
    })
  }

  // Regular community card
  return (
    <TouchableOpacity
      style={tw`rounded-2xl overflow-hidden w-[160px] h-[120px]`}
      onPress={handlePress}
    >
      <ImageBackground
        source={{ uri: props.backgroundImage }}
        style={tw`w-full h-full`}
        resizeMode="cover"
      >
        <View
          style={tw`bg-black bg-opacity-50 h-full flex justify-between py-2 px-2`}
        >
          {/* Interest tags at the top */}
          <View style={tw`flex flex-row flex-wrap`}>
            {props.interests?.slice(0, 2).map((item) => (
              <View
                key={item.id}
                style={tw`bg-white bg-opacity-70 mr-1 mb-1 px-2 py-1 rounded-full`}
              >
                <Text style={tw`text-black text-[10px] font-medium`}>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Bottom section with name and join button */}
          <View style={tw`flex flex-col`}>
            <Text
              category="p1"
              style={tw`text-white text-[14px] font-bold mb-2 leading-4`}
              numberOfLines={2}
            >
              {props.name}
            </Text>

            <View style={tw`flex flex-row items-center justify-between`}>
              {props.memberCount && (
                <Text style={tw`text-white text-[10px] opacity-80`}>
                  {props.memberCount.toLocaleString()} members
                </Text>
              )}
              <View
                style={tw`bg-white bg-opacity-90 px-3 py-1 rounded-full ml-auto`}
              >
                {!!props.isMember ? (
                  <Text style={tw`text-black font-semibold text-[12px]`}>
                    {props.isMember.role}
                  </Text>
                ) : (
                  <Text style={tw`text-black font-semibold text-[12px] `}>
                    Join
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default Community
