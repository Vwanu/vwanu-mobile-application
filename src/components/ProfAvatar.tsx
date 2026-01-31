import { View, TouchableOpacity, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import LongText from './LongText'
import routes from 'navigation/routes'

interface ProfAvatarProps {
  user: User
  subtitle?: string
  size?: number
  layout?: 'col' | 'row'
  onPress?: (user: User) => void
  subtitleParams?: {
    maxLength?: number
    showMoreText?: string
    showLessText?: string
    textStyles?: StyleProp<TextStyle>
  }
  showOnlineStatus?: boolean
  disableDefaultNavigation?: boolean
  titleStyles?: StyleProp<TextStyle>
}

const ProfAvatar: React.FC<ProfAvatarProps> = ({
  layout = 'row',
  showOnlineStatus = false,
  disableDefaultNavigation = false,
  size = 50,
  ...props
}) => {
  const navigation = useNavigation()
  const handlePress = () => {
    if (props.onPress && props.user) {
      props.onPress(props.user)
      return
    }
    // navigate to user profile
    const parentNavigation = navigation.getParent()
    if (parentNavigation) {
      // @ts-ignore
      parentNavigation.navigate(routes.ACCOUNT, {
        screen: routes.PROFILE,
        params: { profileId: props.user.id.toString() },
      })
    } else {
      // Fallback: try direct navigation
      // @ts-ignore
      navigation.navigate(routes.ACCOUNT, {
        screen: routes.PROFILE,
        params: { profileId: props.user.id.toString() },
      })
    }
  }

  return (
    <TouchableOpacity
      style={tw`flex flex-${layout} items-center`}
      onPress={handlePress}
      delayLongPress={800}
      disabled={disableDefaultNavigation}
    >
      <View>
        <Avatar.Image size={size} source={{ uri: props.user.profilePicture }} />
        {showOnlineStatus && props.user.online !== undefined && (
          <View
            style={tw`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
              props.user.online ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        )}
      </View>
      <View style={tw`ml-2 flex justify-center`}>
        <Text style={[tw`font-semibold`, props.titleStyles]}>
          {props.user.firstName} {props.user.lastName}
        </Text>
        {props.subtitle ? (
          <LongText
            textStyles={[tw`font-thin`, props.subtitleParams?.textStyles]}
            text={props?.subtitle}
            maxLength={props?.subtitleParams?.maxLength}
            showMoreText={props?.subtitleParams?.showMoreText}
            showLessText={props?.subtitleParams?.showLessText}
          />
        ) : (
          <Text>{props.user.about || ''}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default ProfAvatar
