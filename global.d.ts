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

type User = {
  firstName: string
  lastName: string
  createdAt: Date
  profilePicture:
    | string
    | {
        original: string
        medium: string
        small: string
        tiny: string
      }
  amountOfFollower: number
  amountOfFollowing: number
  amountOfFriends: number
  nextCompletionStep: NextCompletionStep
  id: string
  email: string
  role?: 'admin' | 'moderator' | 'member'
  online?: boolean
  updatedAt?: Date // last seen date
}

export interface Profile extends User {
  dob?: Date
  gender?: string
  about?: string
  location?: string
}
// This export is necessary to make this file a module
export {}
