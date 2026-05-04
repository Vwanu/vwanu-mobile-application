import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import routes from './routes'
import { RootState } from 'store'
import { NextCompletionStep } from '../../types.d'
import { useFetchProfileQuery } from 'store/profiles'
import FindFriendScreen from 'screens/registrations/FindFriends'
import MoreInfoScreen from 'screens/registrations/MoreInfo.screen'
import ProfilePictureScreen from 'screens/registrations/ProfilePicture'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export type ProfileParamList = {
  [routes.MORE_INFO]: undefined
  [routes.FIND_FRIEND]: undefined
  [routes.PROFILE_PICTURE]: undefined
}
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileParamList>

const { Navigator, Screen } = createStackNavigator<ProfileParamList>()

const RegisterNavigator = () => {
  console.log('RegisterNavigator')
  const { userId } = useSelector((state: RootState) => state.auth)

  const { data, isLoading, error } = useFetchProfileQuery(userId!, {
    skip: !userId,
  })

  // Safe parsing of nextCompletionStep
  const nextAction = React.useMemo(() => {
    if (!data || !data.nextCompletionStep) {
      return NextCompletionStep.START // Default to START if no data
    }

    const step =
      typeof data.nextCompletionStep === 'string'
        ? parseInt(data.nextCompletionStep, 10)
        : Number(data.nextCompletionStep)

    // Validate the parsed value
    if (isNaN(step) || step < 1 || step > 4) {
      console.warn(
        'Invalid nextCompletionStep:',
        data.nextCompletionStep,
        'defaulting to START'
      )
      return NextCompletionStep.START
    }

    return step
  }, [data])

  console.log('nextAction', nextAction, 'data:', data)

  const navigation = useNavigation<ProfileNavigationProp>()

  React.useEffect(() => {
    // Only navigate when we have valid data (not loading)
    if (isLoading || error) return

    switch (nextAction) {
      case NextCompletionStep.FIND_FRIENDS:
        navigation.navigate(routes.FIND_FRIEND)
        break
      case NextCompletionStep.PROFILE_PICTURE:
        navigation.navigate(routes.PROFILE_PICTURE)
        break
      case NextCompletionStep.PROFILE_COMPLETE:
        // No-op — parent navigator (src/navigation/index.tsx) swaps this
        // out for DrawerNavigator. Hitting `default` here would re-route
        // back to PROFILE_PICTURE during the swap-out frame and the user
        // would briefly see the picker again after registering.
        break
      case NextCompletionStep.START:
      default:
        // navigation.navigate(routes.MORE_INFO)
        navigation.navigate(routes.PROFILE_PICTURE)
        break
    }
  }, [nextAction, isLoading, error, navigation])

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={routes.MORE_INFO} component={MoreInfoScreen} />
      <Screen name={routes.FIND_FRIEND} component={FindFriendScreen} />
      <Screen name={routes.PROFILE_PICTURE} component={ProfilePictureScreen} />
    </Navigator>
  )
}

export default RegisterNavigator
