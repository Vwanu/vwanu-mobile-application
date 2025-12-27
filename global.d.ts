// Global ambient type declarations
// These types are available globally without imports

import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import type {
  RootState as StoreRootState,
  AppDispatch as StoreAppDispatch,
} from './src/store'
import type {
  CommunityInterface as CommunityInterfaceType,
  Profile as ProfileType,
  User as UserType,
  Invitation as InvitationType,
  CommunityRole as CommunityRoleType,
  PostProps as PostPropsType,
  Media as MediaType,
} from './types'
import { StackNavigationProp } from '@react-navigation/stack'
declare global {
  // Redux store types
  type RootState = StoreRootState
  type AppDispatch = StoreAppDispatch

  // Tab component props interface - available in all tab components
  interface TabInterFace {
    communityId: string
    onError: (
      error: FetchBaseQueryError | SerializedError,
      onRefetch?: () => void
    ) => void
  }

  // Common entity types
  type Community = CommunityInterfaceType
  type Profile = ProfileType
  type User = UserType
  type Invitation = InvitationType
  type CommunityRole = CommunityRoleType
  type Post = PostPropsType
  type Media = MediaType
}

type CommunityStackParams = {
  Communities: undefined
  CommunityDetail: { communityId: string }
  CreateCommunity: { communityId?: string }
  CommunitySettings: { communityId: string }
}

type CommunityNavigationProp = StackNavigationProp<
  CommunityStackParams,
  'CreateCommunity'
>
// This export is necessary to make this file a module
export {}
