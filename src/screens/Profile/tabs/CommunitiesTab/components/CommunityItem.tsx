import { CommunityInterface } from '../../../../../../types'
import { View, TouchableOpacity, Image } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'

import { useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import routes from 'navigation/routes'
import { ProfileStackParams, BottomTabParms } from '../../../../../../types'
import Text from 'components/Text'
import tw from 'lib/tailwind'
import { cdnImageUrl } from 'lib/cdnImageUrl'
import { Ionicons } from '@expo/vector-icons'
import LongText from 'components/LongText'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParams, typeof routes.PROFILE>,
  BottomTabNavigationProp<BottomTabParms>
>
interface Props {
  community: CommunityInterface
}

const CommunityItem: React.FC<Props> = ({ community }) => {
  const navigation = useNavigation<NavigationProp>()
  const handleCommunityPress = (communityId: string) => {
    navigation.navigate(routes.COMMUNITY, {
      screen: 'CommunityDetail',
      params: { communityId },
    })
  }
  return (
    <TouchableOpacity
      style={tw`flex flex-row justify-between gap-3 items-center p-4 bg-white rounded-2xl shadow my-2`}
      onPress={() => handleCommunityPress(community.id.toString())}
    >
      {/* the community Profile picture */}
      <View style={tw`w-20 h-20 rounded-lg overflow-hidden `}>
        <Image
          source={{
            uri: cdnImageUrl(community.profilePicture, {
              width: 200,
              height: 200,
            }),
          }}
          style={tw`w-full h-full object-cover`}
        />
      </View>
      <View style={tw`flex-1`}>
        <LongText
          textStyles={tw`text-lg font-medium`}
          text={community.name}
          maxLength={15}
          showShowMoreText={false}
        />
        <LongText
          textStyles={tw`text-lg font-thin text-sm no-wrap`}
          text={community.description}
          maxLength={20}
          showShowMoreText={false}
        />
        <View
          style={tw`text-gray-500 text-sm mt-1 text-start  items-center flex-row gap-1`}
        >
          <Ionicons name="people" size={14} color={tw.color('gray-400')} />{' '}
          <Text style={tw`text-gray-500 text-sm no-wrap`}>
            {community.membersCount || 1} members
          </Text>
        </View>
      </View>
      <Text
        style={tw`text-primary-deep font-poppins-semibold text-sm bg-primary-soft px-2 p-1 capitalize rounded-full`}
      >
        {community.IsMember?.role}
      </Text>
    </TouchableOpacity>
  )
}

export default CommunityItem
