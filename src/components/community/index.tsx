import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, ImageBackground, TouchableOpacity } from 'react-native'

import Text from '../Text'
import tw from '../../lib/tailwind'
import routes from '../../navigation/routes'
import { LinearGradient } from 'expo-linear-gradient'

const GRADIENT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['rgba(27,31,94,0.85)', 'rgba(247,108,94,0.45)'],
  ['rgba(27,31,94,0.85)', 'rgba(244,163,0,0.45)'],
  ['rgba(43,49,128,0.85)', 'rgba(247,108,94,0.5)'],
  ['rgba(27,31,94,0.9)', 'rgba(59,130,246,0.45)'],
  ['rgba(43,49,128,0.85)', 'rgba(197,132,0,0.45)'],
]

const gradientFor = (id: string | number): readonly [string, string] => {
  const key = String(id)
  let hash = 0
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  return GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length]
}

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
        <LinearGradient
          colors={gradientFor(id)}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={tw`flex-1 p-3 justify-end`}
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
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default Community
