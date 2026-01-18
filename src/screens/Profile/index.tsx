import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { BottomTabParms, ProfileStackParams } from '../../../types'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import { RootState } from 'store'
import routes from '../../navigation/routes'

// Components
import ProfileHeader from './ProfileHeader'
import ProfileTabNavigator from './ProfileTabNavigator'

type ProfileRouteProp = RouteProp<ProfileStackParams, typeof routes.PROFILE>

const Profile: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParms>>()
  const route = useRoute<ProfileRouteProp>()

  const profileId = route.params?.profileId || userId

  return (
    <Screen safeArea={false}>
      <>
        {/* Profile Header */}
        <ProfileHeader profileId={profileId!} />

        <ProfileTabNavigator
          userId={userId}
          targetUserId={profileId}
          navigation={navigation}
        />
      </>
    </Screen>
  )
}

export default Profile
