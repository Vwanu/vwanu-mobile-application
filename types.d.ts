import routes from './src/navigation/routes'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { NavigatorScreenParams } from '@react-navigation/native'

// Import generated types from backend API
export * from './src/types/generatedTypes'

// Frontend-specific types and overrides
type Id = string | number

// Type aliases to resolve conflicts between frontend and backend types
// Use backend types as base and extend with frontend-specific properties
export type BackendUser = UserInterface
export type BackendPost = PostInterface
export type BackendProfile = ProfileInterface

type PaginatedResponse<T> = {
  limit: number
  skip: number
  total: number
  data: T[]
}
interface ListItem {
  label: string
  value: string
}

interface Media {
  id: number
  original: string
  medium: string
  large: string
  small: string
  tiny: string
  post_id: number
  UserId: number
  height: number
}

export enum NextCompletionStep {
  START = 1,
  FIND_FRIENDS = 2,
  PROFILE_PICTURE = 3,
  PROFILE_COMPLETE = 4,
}
export interface User {
  firstName: string
  lastName: string
  createdAt: Date
  profilePicture: string
  amountOfFollower: number
  amountOfFollowing: number
  amountOfFriends: number
  nextCompletionStep: NextCompletionStep
  id: string
  email: string
  role?: 'admin' | 'moderator' | 'member'
  online?: boolean
  last_seen?: Date
  about?: string
}

export type Notice = 'public' | 'private' | 'network'

// Community privacy types
export type CommunityPrivacyType = 'public' | 'private' | 'hidden'

export interface CommunityPrivacyConfig {
  type: CommunityPrivacyType
  requireApproval: boolean
  description: string
}

export interface PostProps {
  postText?: string
  media?: Media[]
  amountOfKorems: number
  amountOfComments: number
  likers?: User[]
  user?: User
  reactors: User[]
  id: number | string
  canDelete?: boolean
  isReactor?: boolean
  createdAt: Date
  privacyType: Notice
  userId: number | string
  disableNavigation?: boolean
  communityId?: string
}

export interface UpdatePost {
  id: string | number
  data: Partial<PostProps>
}

export interface PostKoremProps {
  postId: number
  User: User
  createdAt: Date
}

interface CommentInterface extends Omit<PostProps, 'media'> {
  postId: Pick<PostProps, 'id'>
}
export type FeedStackParams = Record<string, object | undefined> & {
  Feed: undefined
  Comment: PostProps
  Gallery: PostProps & { initialSlide?: number }
  SinglePost: { postId: string; isCommenting?: boolean }
}

export type ProfileStackParams = {
  [routes.PROFILE]: { profileId: string } | undefined
  SinglePost: { postId: string; isCommenting?: boolean }
  Notifications: undefined
  FriendRequests: undefined
  Settings: undefined
  NotificationSettings: undefined
  AccountSettings: undefined
  PrivacySettings: undefined
  AppearanceSettings: undefined
  HelpSettings: undefined
  AboutSettings: undefined
}

export type CommunityStackParams = {
  Communities: undefined
  CommunityDetail: { communityId: string }
  CreateCommunity: { communityId?: string }
  CommunitySettings: { communityId: string }
}

export type ChatStackParams = {
  Chat: undefined
  Message: { conversationId: string; user?: Partial<User> }
}

export type BottomTabParams = {
  [routes.TIMELINE]: undefined
  [routes.ACCOUNT]: NavigatorScreenParams<ProfileStackParams> | undefined
  [routes.INBOX]: NavigatorScreenParams<ChatStackParams> | undefined
  [routes.COMMUNITY]: NavigatorScreenParams<CommunityStackParams> | undefined
}

export interface Message {
  id: string
  conversationId: string
  messageText: string
  createdAt: string
  user: User
  readDate: string
}

// Base conversation properties shared by both types
export interface Conversation {
  id: string
  type: 'direct' | 'group'
  users: User[]
  messages: Message[]
  lastMessage: Message
  amountOfUnreadMessages: number
  groupName?: string
  groupPicture?: string
}

export interface EntityCreate<T> {
  data: T
}

interface Profiles extends User {
  id: string
  bio?: string
  email: string
  gender?: string
  emailVerified: boolean
  dob?: string
  searchVector?: string | null
  online: boolean
}

export interface CommunityInterface {
  name: string
  profilePicture: string
  createdAt: string
  id: string
  interests?: Interest[]
  canInvite: string
  canPost: string
  createdAt: Date
  creatorId: string
  description: string
  id: string
  members: User[]
  numAdmins: number
  numMembers: number
  privacyType: string
  profilePicture: string
  updatedAt: Date
  isCreateCard?: boolean
  IsMember?: Member
  pendingInvitation?: Invitation
  pendingJoinRequest: boolean
}

export interface Invitation {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  guest: Partial<User> & { profilePicture: string }
  host: Partial<User> & { profilePicture: string }
  response?: boolean
  updatedAt: Date
  communityRole: CommunityRole
}

export interface CommunityRole {
  id: string
  name: string
  roleAccessLevel: number
}

// Notification types
export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'community_invite'
  | 'community_join_request'
  | 'community_post'
  | 'mention'
  | 'system'

export interface NotificationInterface {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  entityId: string
  entityName: 'Post' | 'Like' | 'Comment' | 'CommunityInvite'
  fromUser: Partial<User> & { profilePicture: string }
  metadata?: {
    postId?: string
    communityId?: string
    commentId?: string
    [key: string]: any
  }
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  communityInvites: boolean
  communityPosts: boolean
  likes: boolean
  comments: boolean
  follows: boolean
  mentions: boolean
}

export interface FetchNotificationsParams {
  page?: number
  limit?: number
  unreadOnly?: boolean
}

export interface MarkNotificationsReadParams {
  notificationIds: string[]
}

// Friend Request Types
export type FriendRequestStatus = 'pending' | 'accepted' | 'declined'

export interface FriendRequestInterface {
  id: string
  userId: string
  targetId: string
  status: FriendRequestStatus
  createdAt: Date
  updatedAt: Date
  user: User
  target: User
}

export interface FetchFriendRequestsParams {
  userId?: string
  targetId?: string
  status?: FriendRequestStatus
}

export interface SendFriendRequestParams {
  targetId: string
}

export interface SVGProps {
  width?: number | string
  height?: number | string
  fill?: string
  stroke?: boolean
}
export interface RespondToFriendRequestParams {
  requestId: string
  action: 'accept' | 'decline'
}
