import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import { Tabs, TabContent } from '../../components/Tabs'
import { CommunityGridCard, CommunityStats } from './components'
import { CommunityInterface, CommunityStackParams } from '../../../types'
import { useFetchCommunityQuery } from '../../store/communities-api-slice'

// Tab components
import PostsTab from './tabs/PostsTab'
import MembersTab from './tabs/MembersTab'
import SettingsTab from './tabs/SettingsTab'
import InvitationsTab from './tabs/InvitationsTab'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { getErrorObject, ErrorObject } from '../../utils/errorHelpers'

type CommunityDetailRouteProp = RouteProp<
  CommunityStackParams,
  'CommunityDetail'
>

const CommunityDetail = () => {
  const route = useRoute<CommunityDetailRouteProp>()
  const { communityId } = route.params
  const {
    data: community,
    isLoading,
    error,
    refetch,
  } = useFetchCommunityQuery(communityId)

  const [tabError, setTabError] = useState<ErrorObject | null>(null)

  // Handle errors from tabs
  const onError = (
    error: FetchBaseQueryError | SerializedError,
    onRefetch?: () => void
  ) => {
    const errorObject = getErrorObject(error, () => {
      // Clear tab error if no specific refetch provided
      setTabError(null)
      onRefetch?.()
    })
    setTabError(errorObject)
  }

  // Combine query error and tab errors
  const displayError: ErrorObject | string | null = error
    ? getErrorObject(error, refetch)
    : tabError

  // Clear tab error when component unmounts
  useEffect(() => {
    return () => setTabError(null)
  }, [])

  const tabs: TabContent[] = [
    {
      id: 'posts',
      label: 'Posts',
      icon: 'newspaper-outline',
      component: (
        <PostsTab
          communityId={communityId}
          onError={onError}
          canCreatePost={community?.isMember ? true : false}
        />
      ),
      show: true,
    },
    {
      id: 'members',
      label: 'Members',
      icon: 'people-outline',
      component: <MembersTab communityId={communityId} onError={onError} />,
      show: true,
      disabled: community?.isMember ? false : true,
    },
    {
      id: 'invitations',
      label: 'Invites',
      icon: 'mail-outline',
      component: <InvitationsTab communityId={communityId} onError={onError} />,
      show: community?.isMember,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings-outline',
      component: <SettingsTab communityId={communityId} onError={onError} />,
      show: true,
      disabled: community?.isMember ? false : true,
    },
  ]
  return (
    <Screen loading={isLoading} error={displayError} safeArea={false}>
      <View style={tw`flex-1`}>
        <CommunityGridCard
          community={community as CommunityInterface}
          size="large"
          onCommunityPress={() => {}}
          style={tw`rounded-none`}
          displayDetails={true}
        />

        <CommunityStats
          numMembers={community?.numMembers || 0}
          numAdmins={community?.numAdmins || 0}
          numPosts={15}
        />

        <Tabs tabs={tabs} defaultTab="posts" />
      </View>
    </Screen>
  )
}

export default CommunityDetail
