# Feature Roadmap - Vwanu Social Application

**Document Version:** 1.0
**Last Updated:** 2025-10-19
**Status:** Planning Phase

---

## Table of Contents
1. [Epic 1: Chat System](#epic-1-chat-system)
2. [Epic 2: Friend System](#epic-2-friend-system)
3. [Epic 3: Follow System](#epic-3-follow-system)
4. [Epic 4: Forum/Discussion System](#epic-4-forumdiscussion-system)
5. [Epic 5: Notification System](#epic-5-notification-system)
6. [Epic 6: Profile Settings Enhancement](#epic-6-profile-settings-enhancement)
7. [Epic 7: Community Management Enhancement](#epic-7-community-management-enhancement)
8. [Implementation Priorities](#implementation-priorities)
9. [Technical Dependencies](#technical-dependencies)

---

## Epic 1: Chat System

### Overview
Build a comprehensive real-time chat system allowing users to send direct messages, create group chats, and share media.

### User Stories
- As a user, I want to send direct messages to my friends so I can communicate privately
- As a user, I want to create group chats so I can talk with multiple friends at once
- As a user, I want to share images, videos, and files in chats
- As a user, I want to see when messages are read
- As a user, I want to receive real-time message notifications

---

### CHAT-001: Chat API Slice with RTK Query
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Create a comprehensive Redux Toolkit Query API slice for all chat-related operations.

**Technical Requirements:**
- Create `src/store/chat-api-slice.ts`
- Implement RTK Query endpoints
- Add WebSocket integration for real-time updates
- Implement optimistic updates for message sending

**API Endpoints Required:**
```typescript
// Conversations
GET    /conversations              // List all conversations
GET    /conversations/:id          // Get conversation details
POST   /conversations              // Create new conversation
DELETE /conversations/:id          // Delete conversation
PUT    /conversations/:id/read     // Mark as read

// Messages
GET    /conversations/:id/messages // Get messages (paginated)
POST   /conversations/:id/messages // Send message
DELETE /messages/:id               // Delete message
PUT    /messages/:id               // Edit message

// Group Chats
POST   /conversations/:id/members  // Add members
DELETE /conversations/:id/members/:userId // Remove member
PUT    /conversations/:id          // Update group (name, photo)
```

**Redux Types Needed:**
```typescript
interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  mediaUrls?: string[]
  readBy: string[]
  createdAt: string
  updatedAt: string
  deleted: boolean
}

interface Conversation {
  id: string
  type: 'direct' | 'group'
  name?: string // for groups
  participants: User[]
  lastMessage: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  groupPhoto?: string
}
```

**Acceptance Criteria:**
- [ ] All CRUD operations for conversations work
- [ ] Messages can be sent and received
- [ ] Pagination works for message history
- [ ] Real-time updates via WebSocket
- [ ] Proper error handling
- [ ] Loading states managed

---

### CHAT-002: WebSocket Integration for Real-Time Messaging
**Priority:** P0 (Critical)
**Estimated Effort:** 8 points
**Dependencies:** CHAT-001

**Description:**
Integrate WebSocket connection for real-time message delivery and presence updates.

**Technical Requirements:**
- Create `src/lib/websocket/ChatWebSocket.ts`
- Implement connection management with auto-reconnect
- Handle message delivery confirmations
- Implement typing indicators
- Handle online/offline presence

**Implementation Details:**
```typescript
class ChatWebSocket {
  private socket: WebSocket | null
  private reconnectAttempts: number

  connect(userId: string): void
  disconnect(): void
  sendMessage(message: Message): void
  onMessageReceived(callback: (message: Message) => void): void
  onTypingIndicator(callback: (userId: string, isTyping: boolean) => void): void
  onPresenceUpdate(callback: (userId: string, status: 'online' | 'offline') => void): void
}
```

**Acceptance Criteria:**
- [ ] WebSocket connects on app start (when authenticated)
- [ ] Auto-reconnects on connection loss
- [ ] Messages delivered in real-time
- [ ] Typing indicators work
- [ ] Online presence updates work
- [ ] Handles auth token refresh

---

### CHAT-003: Chat List Screen Enhancement
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** CHAT-001

**Description:**
Enhance the existing Chat screen (`src/screens/Chat/index.tsx`) to display real conversations with proper data.

**Technical Requirements:**
- Replace mock data with RTK Query hooks
- Add pull-to-refresh
- Implement search functionality
- Add swipe actions (archive, delete)
- Show unread badges
- Display last message preview
- Show timestamp

**UI Components Needed:**
- ConversationListItem
- SearchBar (enhance existing)
- UnreadBadge
- LastMessagePreview

**Acceptance Criteria:**
- [ ] Real conversations displayed from API
- [ ] Unread count badges visible
- [ ] Last message preview shows
- [ ] Search filters conversations
- [ ] Pull-to-refresh updates list
- [ ] Swipe to delete/archive works
- [ ] Tapping conversation navigates to chat

---

### CHAT-004: Message Screen Implementation
**Priority:** P0 (Critical)
**Estimated Effort:** 8 points
**Dependencies:** CHAT-001, CHAT-002

**Description:**
Complete the Message screen (`src/screens/Chat/Message.tsx`) for one-on-one and group conversations.

**Technical Requirements:**
- Implement message list with FlatList (inverted)
- Add message input with media attachment
- Show typing indicators
- Display read receipts
- Implement message bubbles (sent/received)
- Add timestamp grouping
- Handle pagination for message history

**Features:**
- Send text messages
- Send images/videos
- Delete messages
- Copy messages
- Reply to messages
- Show delivery status

**Acceptance Criteria:**
- [ ] Messages display in correct order
- [ ] Can send text messages
- [ ] Can attach and send media
- [ ] Typing indicators visible
- [ ] Read receipts shown
- [ ] Pagination loads older messages
- [ ] Real-time updates work

---

### CHAT-005: Group Chat Management
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** CHAT-001, CHAT-004

**Description:**
Implement group chat creation and management features.

**Technical Requirements:**
- Create GroupChatSettings screen
- Implement member selection
- Allow adding/removing members
- Edit group name and photo
- Leave group functionality

**New Screens:**
- `src/screens/Chat/CreateGroupChat.tsx`
- `src/screens/Chat/GroupChatSettings.tsx`
- `src/screens/Chat/AddGroupMembers.tsx`

**Acceptance Criteria:**
- [ ] Can create group chat
- [ ] Can add members to group
- [ ] Can remove members (if admin)
- [ ] Can edit group name
- [ ] Can upload group photo
- [ ] Can leave group

---

### CHAT-006: Media Sharing in Chat
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** CHAT-004

**Description:**
Implement media upload, preview, and viewing in chat.

**Technical Requirements:**
- Integrate image picker
- Implement video picker
- Add file upload (documents)
- Image/video preview before send
- Full-screen media viewer
- Download media functionality

**Components:**
- MediaPicker
- MediaPreview
- MediaViewer (full-screen)
- DownloadButton

**Acceptance Criteria:**
- [ ] Can select images from gallery
- [ ] Can capture photos with camera
- [ ] Can select videos
- [ ] Preview before sending
- [ ] Media displays in chat
- [ ] Can view full-screen
- [ ] Can download/save media

---

### CHAT-007: Chat Navigation Integration
**Priority:** P0 (Critical)
**Estimated Effort:** 2 points
**Dependencies:** CHAT-003, CHAT-004

**Description:**
Integrate chat screens into navigation and add deep linking.

**Technical Requirements:**
- Update navigation config
- Add chat navigation routes
- Implement deep links to conversations
- Add navigation from friend/profile to chat

**Files to Update:**
- `src/navigation/routes.ts`
- `src/navigation/index.tsx`
- Add ChatStackNavigator

**New Routes:**
```typescript
enum routes {
  // ... existing routes
  CHAT = 'CHAT',
  CONVERSATION = 'CONVERSATION',
  CREATE_GROUP_CHAT = 'CREATE_GROUP_CHAT',
  GROUP_CHAT_SETTINGS = 'GROUP_CHAT_SETTINGS',
  ADD_GROUP_MEMBERS = 'ADD_GROUP_MEMBERS',
}
```

**Acceptance Criteria:**
- [ ] Chat list accessible from bottom tab
- [ ] Can navigate to conversation
- [ ] Back navigation works correctly
- [ ] Deep links to chat work
- [ ] Navigation from profile to chat works

---

## Epic 2: Friend System

### Overview
Implement a comprehensive friend request and friendship management system.

### User Stories
- As a user, I want to send friend requests so I can connect with people
- As a user, I want to accept or decline friend requests
- As a user, I want to see my friends list
- As a user, I want to unfriend people
- As a user, I want to see pending friend requests

---

### FRIEND-001: Friend API Slice
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Create Redux Toolkit Query API slice for friend system operations.

**Technical Requirements:**
- Create `src/store/friends-api-slice.ts`
- Implement all friend-related endpoints
- Add cache invalidation strategies
- Implement optimistic updates

**API Endpoints Required:**
```typescript
// Friend Requests
POST   /friend-requests              // Send friend request
GET    /friend-requests/sent         // Get sent requests
GET    /friend-requests/received     // Get received requests
PUT    /friend-requests/:id/accept   // Accept request
PUT    /friend-requests/:id/decline  // Decline request
DELETE /friend-requests/:id          // Cancel sent request

// Friends
GET    /friends                      // Get friends list
DELETE /friends/:userId              // Unfriend
GET    /friends/:userId              // Get friendship status
GET    /users/:userId/friends        // Get user's friends (public)
```

**Types:**
```typescript
interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  sender: User
  receiver: User
}

interface Friendship {
  id: string
  userId: string
  friendId: string
  createdAt: string
  friend: User
}

interface FriendshipStatus {
  isFriend: boolean
  requestSent: boolean
  requestReceived: boolean
  requestId?: string
}
```

**Acceptance Criteria:**
- [ ] Can send friend requests
- [ ] Can accept/decline requests
- [ ] Can cancel sent requests
- [ ] Can unfriend users
- [ ] Can fetch friends list
- [ ] Can check friendship status

---

### FRIEND-002: Friend Requests Screen
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** FRIEND-001

**Description:**
Create a screen to view and manage friend requests.

**Technical Requirements:**
- Create `src/screens/Friends/FriendRequests.tsx`
- Show received requests (accept/decline)
- Show sent requests (cancel)
- Add tabs for received/sent
- Real-time updates for new requests

**UI Components:**
- FriendRequestItem
- RequestTabs (Received/Sent)
- EmptyState

**Acceptance Criteria:**
- [ ] Received requests displayed
- [ ] Sent requests displayed
- [ ] Can accept requests
- [ ] Can decline requests
- [ ] Can cancel sent requests
- [ ] Badge shows request count
- [ ] Real-time updates work

---

### FRIEND-003: Friends List Screen
**Priority:** P0 (Critical)
**Estimated Effort:** 3 points
**Dependencies:** FRIEND-001

**Description:**
Enhance the FriendsTab to show actual friends list.

**Technical Requirements:**
- Update `src/screens/Profile/tabs/FriendsTab.tsx`
- Replace placeholder with real data
- Add search functionality
- Add alphabetical grouping
- Show mutual friends count

**Features:**
- Search friends
- View friend profile
- Start chat with friend
- Unfriend action

**Acceptance Criteria:**
- [ ] Friends list displays correctly
- [ ] Search filters friends
- [ ] Can navigate to friend profile
- [ ] Can start chat with friend
- [ ] Can unfriend users
- [ ] Shows mutual friends count

---

### FRIEND-004: Connection Status Integration
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** FRIEND-001

**Description:**
Wire up the existing ConnectionStatus component with real API calls.

**Technical Requirements:**
- Update `src/screens/Profile/ConnectionStatus.tsx`
- Integrate with friends API slice
- Handle all connection states
- Add loading states
- Show success/error feedback

**Connection States to Handle:**
- Not connected → Send request
- Request sent → Cancel request
- Request received → Accept/Decline
- Friends → Chat / Unfriend
- Self → Hide buttons

**Acceptance Criteria:**
- [ ] All connection states work correctly
- [ ] Send request works
- [ ] Accept/decline works
- [ ] Cancel request works
- [ ] Unfriend works
- [ ] Loading states shown
- [ ] Error handling works

---

### FRIEND-005: Friend Suggestions
**Priority:** P2 (Medium)
**Estimated Effort:** 5 points
**Dependencies:** FRIEND-001

**Description:**
Implement friend suggestion algorithm and UI.

**Technical Requirements:**
- Create `src/screens/Friends/FriendSuggestions.tsx`
- Implement suggestion algorithm (mutual friends, interests, location)
- Add dismiss suggestion
- Add "already sent request" state

**API Endpoint:**
```typescript
GET /friend-suggestions?limit=20
```

**Suggestion Criteria:**
- Mutual friends
- Common interests
- Same location
- Same communities

**Acceptance Criteria:**
- [ ] Suggestions displayed
- [ ] Can send request from suggestions
- [ ] Can dismiss suggestions
- [ ] Refresh updates suggestions
- [ ] Shows mutual connection count

---

### FRIEND-006: Find Friends Screen Enhancement
**Priority:** P2 (Medium)
**Estimated Effort:** 3 points
**Dependencies:** FRIEND-001

**Description:**
Enhance the existing FindFriends screen with friend request capabilities.

**Technical Requirements:**
- Update `src/screens/registrations/FindFriends.tsx`
- Add friend request buttons
- Show connection status
- Improve search
- Add filters (location, interests)

**Acceptance Criteria:**
- [ ] Can search for users
- [ ] Shows connection status
- [ ] Can send requests
- [ ] Filters work correctly
- [ ] Pagination works

---

## Epic 3: Follow System

### Overview
Implement a follow/unfollow system allowing users to subscribe to others' public content.

### User Stories
- As a user, I want to follow users to see their public posts
- As a user, I want to unfollow users
- As a user, I want to see who follows me
- As a user, I want to see who I'm following

---

### FOLLOW-001: Follow API Slice
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** None

**Description:**
Create API slice for follow operations.

**Technical Requirements:**
- Create `src/store/follow-api-slice.ts`
- Implement follow/unfollow endpoints
- Add followers/following lists

**API Endpoints:**
```typescript
POST   /users/:userId/follow         // Follow user
DELETE /users/:userId/follow         // Unfollow user
GET    /users/:userId/followers      // Get followers
GET    /users/:userId/following      // Get following
GET    /users/:userId/follow-status  // Check if following
```

**Types:**
```typescript
interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
  follower?: User
  following?: User
}

interface FollowStatus {
  isFollowing: boolean
  followsYou: boolean
}
```

**Acceptance Criteria:**
- [ ] Can follow users
- [ ] Can unfollow users
- [ ] Can fetch followers list
- [ ] Can fetch following list
- [ ] Can check follow status

---

### FOLLOW-002: Followers/Following Tabs Enhancement
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** FOLLOW-001

**Description:**
Enhance FollowersTab and FollowingTab with real data.

**Technical Requirements:**
- Update `src/screens/Profile/tabs/FollowersTab.tsx`
- Update `src/screens/Profile/tabs/FollowingTab.tsx`
- Replace mock data with API calls
- Add follow back functionality
- Add remove follower (for own profile)

**Acceptance Criteria:**
- [ ] Followers list displays correctly
- [ ] Following list displays correctly
- [ ] Can follow back from followers tab
- [ ] Can unfollow from following tab
- [ ] Can remove followers
- [ ] Shows mutual follow status

---

### FOLLOW-003: Follow Button Component
**Priority:** P1 (High)
**Estimated Effort:** 2 points
**Dependencies:** FOLLOW-001

**Description:**
Create reusable follow button component.

**Technical Requirements:**
- Create `src/components/FollowButton.tsx`
- Handle loading states
- Show different states (Follow/Following/Follow Back)
- Optimistic updates

**States:**
- Not following → "Follow"
- Following → "Following"
- They follow you → "Follow Back"
- Loading → Spinner

**Acceptance Criteria:**
- [ ] Renders correct state
- [ ] Handles follow action
- [ ] Handles unfollow action
- [ ] Shows loading state
- [ ] Optimistic updates work

---

### FOLLOW-004: Follow Feed Integration
**Priority:** P2 (Medium)
**Estimated Effort:** 3 points
**Dependencies:** FOLLOW-001

**Description:**
Add a "Following" feed showing posts from followed users.

**Technical Requirements:**
- Update Timeline screen
- Add tab for "Following" feed
- Filter posts by followed users
- Add "no following" empty state

**API Endpoint:**
```typescript
GET /feed/following?page=1&limit=10
```

**Acceptance Criteria:**
- [ ] Following feed displays
- [ ] Shows only posts from followed users
- [ ] Pagination works
- [ ] Empty state shows when not following anyone
- [ ] Pull to refresh works

---

## Epic 4: Forum/Discussion System

### Overview
Create interest-based forums where users can have threaded discussions on specific topics.

### User Stories
- As a user, I want to join forums based on my interests
- As a user, I want to create discussion threads
- As a user, I want to reply to discussions
- As a user, I want to search forum topics

---

### FORUM-001: Forum Data Model & API Slice
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Create the data model and API slice for forum system.

**Technical Requirements:**
- Create `src/store/forum-api-slice.ts`
- Define TypeScript interfaces
- Implement CRUD operations

**API Endpoints:**
```typescript
// Forums
GET    /forums                      // List all forums
GET    /forums/:id                  // Get forum details
POST   /forums                      // Create forum (admin)
PUT    /forums/:id                  // Update forum (admin)

// Forum Topics/Threads
GET    /forums/:id/topics           // Get topics in forum
POST   /forums/:id/topics           // Create new topic
GET    /topics/:id                  // Get topic details
PUT    /topics/:id                  // Update topic
DELETE /topics/:id                  // Delete topic
POST   /topics/:id/pin              // Pin topic (moderator)
POST   /topics/:id/lock             // Lock topic (moderator)

// Replies
GET    /topics/:id/replies          // Get replies
POST   /topics/:id/replies          // Add reply
PUT    /replies/:id                 // Edit reply
DELETE /replies/:id                 // Delete reply
POST   /replies/:id/like            // Like reply

// Subscriptions
POST   /forums/:id/subscribe        // Subscribe to forum
DELETE /forums/:id/subscribe        // Unsubscribe
POST   /topics/:id/subscribe        // Subscribe to topic
```

**Types:**
```typescript
interface Forum {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  interestId?: string
  topicCount: number
  postCount: number
  subscriberCount: number
  createdAt: string
}

interface ForumTopic {
  id: string
  forumId: string
  title: string
  content: string
  authorId: string
  author: User
  isPinned: boolean
  isLocked: boolean
  replyCount: number
  viewCount: number
  lastReplyAt?: string
  lastReplyBy?: User
  createdAt: string
  updatedAt: string
}

interface ForumReply {
  id: string
  topicId: string
  content: string
  authorId: string
  author: User
  likeCount: number
  createdAt: string
  updatedAt: string
}
```

**Acceptance Criteria:**
- [ ] All CRUD operations work
- [ ] Pagination implemented
- [ ] Sorting options work
- [ ] Subscribe/unsubscribe works

---

### FORUM-002: Forums List Screen
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** FORUM-001

**Description:**
Create main forums listing screen.

**Technical Requirements:**
- Create `src/screens/Forums/ForumsList.tsx`
- Show all available forums
- Display forum stats
- Add search/filter by interest

**UI Components:**
- ForumCard (shows name, description, stats)
- ForumSearch
- InterestFilter

**Acceptance Criteria:**
- [ ] Forums list displays
- [ ] Shows topic/post counts
- [ ] Search filters forums
- [ ] Can filter by interest
- [ ] Tapping navigates to forum

---

### FORUM-003: Forum Detail Screen
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** FORUM-001

**Description:**
Create forum detail screen showing topics.

**Technical Requirements:**
- Create `src/screens/Forums/ForumDetail.tsx`
- List all topics in forum
- Show pinned topics first
- Add sorting (recent, popular, trending)
- Add subscribe button

**Features:**
- View topics
- Create new topic
- Subscribe to forum
- Sort topics

**Acceptance Criteria:**
- [ ] Topics listed correctly
- [ ] Pinned topics show first
- [ ] Sorting works
- [ ] Can create topic
- [ ] Subscribe works
- [ ] Locked topics indicated

---

### FORUM-004: Topic Detail Screen
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** FORUM-001

**Description:**
Create topic detail screen with threaded replies.

**Technical Requirements:**
- Create `src/screens/Forums/TopicDetail.tsx`
- Show original post
- Display replies
- Implement reply functionality
- Show author info
- Add like functionality

**Features:**
- View topic and replies
- Add reply
- Edit own reply
- Delete own reply
- Like replies
- Quote reply

**Acceptance Criteria:**
- [ ] Topic content displays
- [ ] Replies listed
- [ ] Can add reply
- [ ] Can edit/delete own reply
- [ ] Like button works
- [ ] Shows locked state

---

### FORUM-005: Create Topic Screen
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** FORUM-001

**Description:**
Create screen for starting new forum topics.

**Technical Requirements:**
- Create `src/screens/Forums/CreateTopic.tsx`
- Title input
- Rich text editor for content
- Add tags/categories
- Preview functionality

**Validation:**
- Title: required, 10-200 chars
- Content: required, min 50 chars

**Acceptance Criteria:**
- [ ] Can enter title
- [ ] Can enter content
- [ ] Validation works
- [ ] Preview shows correctly
- [ ] Topic creates successfully

---

### FORUM-006: Forum Navigation Integration
**Priority:** P1 (High)
**Estimated Effort:** 2 points
**Dependencies:** FORUM-002, FORUM-003, FORUM-004

**Description:**
Add forum navigation to app.

**Technical Requirements:**
- Create ForumNavigator
- Add to drawer/bottom tabs
- Add routes
- Integrate deep linking

**New Routes:**
```typescript
enum routes {
  FORUMS = 'FORUMS',
  FORUM_DETAIL = 'FORUM_DETAIL',
  TOPIC_DETAIL = 'TOPIC_DETAIL',
  CREATE_TOPIC = 'CREATE_TOPIC',
}
```

**Acceptance Criteria:**
- [ ] Forums accessible from main navigation
- [ ] All forum screens navigable
- [ ] Back navigation works
- [ ] Deep links work

---

## Epic 5: Notification System

### Overview
Implement comprehensive notification system with push notifications and in-app alerts.

### User Stories
- As a user, I want to receive notifications for friend requests
- As a user, I want to receive notifications for post likes and comments
- As a user, I want to receive notifications for new messages
- As a user, I want to control which notifications I receive

---

### NOTIF-001: Notification API Slice
**Priority:** P0 (Critical)
**Estimated Effort:** 3 points
**Dependencies:** None

**Description:**
Create API slice for notification operations.

**Technical Requirements:**
- Create `src/store/notifications-api-slice.ts`
- Implement notification fetching and management
- Add real-time notification updates

**API Endpoints:**
```typescript
GET    /notifications                // Get all notifications
GET    /notifications/unread         // Get unread count
PUT    /notifications/:id/read       // Mark as read
PUT    /notifications/read-all       // Mark all as read
DELETE /notifications/:id            // Delete notification
PUT    /notifications/settings       // Update notification preferences
```

**Types:**
```typescript
interface Notification {
  id: string
  userId: string
  type: NotificationType
  actorId: string
  actor: User
  targetId?: string // post ID, comment ID, etc.
  targetType?: string // 'post', 'comment', 'community'
  content: string
  isRead: boolean
  createdAt: string
  metadata?: Record<string, any>
}

enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  FRIEND_REQUEST_ACCEPTED = 'friend_request_accepted',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  COMMENT_REPLY = 'comment_reply',
  NEW_FOLLOWER = 'new_follower',
  MESSAGE = 'message',
  COMMUNITY_INVITE = 'community_invite',
  COMMUNITY_JOIN_REQUEST = 'community_join_request',
  COMMUNITY_POST = 'community_post',
  PROFILE_VISIT = 'profile_visit',
  MENTION = 'mention',
}

interface NotificationSettings {
  pushEnabled: boolean
  emailEnabled: boolean
  types: {
    [key in NotificationType]: boolean
  }
}
```

**Acceptance Criteria:**
- [ ] Can fetch notifications
- [ ] Can mark as read
- [ ] Can delete notifications
- [ ] Unread count updates
- [ ] Settings save correctly

---

### NOTIF-002: Push Notification Setup (Expo)
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Set up Expo push notifications with device token registration.

**Technical Requirements:**
- Configure Expo push notifications
- Request permissions
- Register device token with backend
- Handle notification receipts
- Handle foreground/background notifications

**Files to Create:**
- `src/lib/pushNotifications.ts`
- `src/hooks/usePushNotifications.ts`

**Implementation:**
```typescript
// Push notification service
class PushNotificationService {
  async registerForPushNotifications(): Promise<string>
  async unregisterDevice(): Promise<void>
  setupNotificationHandler(): void
  handleNotificationReceived(notification: Notification): void
  handleNotificationResponse(response: NotificationResponse): void
}
```

**Backend API:**
```typescript
POST   /users/device-tokens          // Register device token
DELETE /users/device-tokens/:token   // Unregister device
```

**Acceptance Criteria:**
- [ ] Permission requested correctly
- [ ] Device token registered
- [ ] Notifications received in foreground
- [ ] Notifications received in background
- [ ] Tapping notification navigates correctly
- [ ] Unregister on logout works

---

### NOTIF-003: Notification Center Screen
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** NOTIF-001

**Description:**
Create notification center to view all notifications.

**Technical Requirements:**
- Create `src/screens/Notifications/NotificationCenter.tsx`
- List all notifications
- Group by date
- Add filters (all, unread, mentions)
- Implement mark all as read
- Add swipe to delete

**UI Components:**
- NotificationItem (different rendering per type)
- NotificationDateHeader
- FilterTabs
- EmptyState

**Features:**
- Tap notification to navigate to related content
- Swipe to delete
- Mark individual as read
- Mark all as read
- Pull to refresh

**Acceptance Criteria:**
- [ ] Notifications display correctly
- [ ] Each type renders appropriately
- [ ] Tapping navigates correctly
- [ ] Swipe to delete works
- [ ] Mark as read works
- [ ] Filters work correctly
- [ ] Unread badge updates

---

### NOTIF-004: Notification Badge Integration
**Priority:** P0 (Critical)
**Estimated Effort:** 2 points
**Dependencies:** NOTIF-001

**Description:**
Add notification badges throughout the app.

**Technical Requirements:**
- Add badge to notification icon in navigation
- Create reusable Badge component
- Update badge count in real-time
- Clear badge on notification screen view

**Components:**
- `src/components/NotificationBadge.tsx`

**Locations:**
- Bottom tab navigation
- Drawer navigation
- App icon (via Expo)

**Acceptance Criteria:**
- [ ] Badge shows on navigation icon
- [ ] Count updates in real-time
- [ ] Badge clears when viewing notifications
- [ ] App icon badge updates (iOS/Android)

---

### NOTIF-005: Notification Settings Implementation
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** NOTIF-001, NOTIF-002

**Description:**
Connect existing NotificationSettings screen to real API.

**Technical Requirements:**
- Update `src/screens/Settings/NotificationSettings.tsx`
- Replace mock data with API calls
- Save settings to backend
- Test each notification type

**Settings to Implement:**
- Push notifications toggle (master)
- Email notifications toggle (master)
- Individual notification type toggles

**Acceptance Criteria:**
- [ ] Settings load from API
- [ ] Changes save to backend
- [ ] Push notification permission requested
- [ ] Toggles update correctly
- [ ] Changes reflect immediately

---

### NOTIF-006: Real-Time Notification Updates
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** NOTIF-001, NOTIF-002, CHAT-002 (WebSocket)

**Description:**
Implement real-time notification delivery via WebSocket.

**Technical Requirements:**
- Extend ChatWebSocket or create NotificationWebSocket
- Listen for new notifications
- Update Redux store in real-time
- Show in-app notification toast
- Play notification sound

**Events:**
```typescript
// WebSocket events
'notification:new'     // New notification received
'notification:read'    // Notification marked as read
'notification:deleted' // Notification deleted
```

**Components:**
- `src/components/NotificationToast.tsx`

**Acceptance Criteria:**
- [ ] Notifications arrive in real-time
- [ ] Toast shows for new notifications
- [ ] Badge updates immediately
- [ ] Sound plays (if enabled)
- [ ] WebSocket reconnects properly

---

### NOTIF-007: Profile Visit Tracking
**Priority:** P2 (Medium)
**Estimated Effort:** 2 points
**Dependencies:** NOTIF-001

**Description:**
Track and notify users when someone views their profile.

**Technical Requirements:**
- Track profile views
- Send notification (if enabled)
- Create profile visitors list
- Respect privacy settings

**API Endpoints:**
```typescript
POST /users/:userId/view             // Track profile view
GET  /users/:userId/visitors         // Get recent visitors
```

**Privacy Considerations:**
- Allow users to opt-out of tracking
- Allow users to browse anonymously
- Add to privacy settings

**Acceptance Criteria:**
- [ ] Profile views tracked
- [ ] Notification sent (if enabled)
- [ ] Visitors list viewable
- [ ] Privacy settings respected
- [ ] Anonymous browsing works

---

## Epic 6: Profile Settings Enhancement

### Overview
Enhance profile and account settings with privacy controls and customization.

### User Stories
- As a user, I want to control who can see my posts
- As a user, I want to control who can send me friend requests
- As a user, I want to block users
- As a user, I want to customize my profile

---

### PROFILE-001: Privacy Settings Implementation
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Implement comprehensive privacy settings.

**Technical Requirements:**
- Update `src/screens/Settings/PrivacySettings.tsx`
- Add privacy options
- Save to backend
- Enforce on frontend

**Privacy Options:**
```typescript
interface PrivacySettings {
  // Profile visibility
  profileVisibility: 'public' | 'friends' | 'private'

  // Post visibility
  defaultPostVisibility: 'public' | 'friends' | 'private'

  // Who can...
  whoCanSendFriendRequests: 'everyone' | 'friends-of-friends' | 'none'
  whoCanFollowYou: 'everyone' | 'no-one'
  whoCanSeeYourFriends: 'everyone' | 'friends' | 'only-me'
  whoCanSeeYourFollowers: 'everyone' | 'friends' | 'only-me'
  whoCanMessageYou: 'everyone' | 'friends' | 'no-one'
  whoCanTagYou: 'everyone' | 'friends' | 'no-one'

  // Other
  showOnlineStatus: boolean
  allowProfileVisitNotifications: boolean
  allowAnonymousViewing: boolean
}
```

**API:**
```typescript
GET /users/me/privacy-settings
PUT /users/me/privacy-settings
```

**Acceptance Criteria:**
- [ ] All privacy options configurable
- [ ] Settings save successfully
- [ ] Settings load on screen mount
- [ ] UI reflects current settings
- [ ] Privacy enforced throughout app

---

### PROFILE-002: Block User Functionality
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** PROFILE-001

**Description:**
Implement user blocking functionality.

**Technical Requirements:**
- Create blocked users management
- Hide blocked users content
- Prevent interactions
- Add unblock functionality

**API Endpoints:**
```typescript
POST   /users/:userId/block          // Block user
DELETE /users/:userId/block          // Unblock user
GET    /users/blocked                // Get blocked users list
```

**Effects of Blocking:**
- Cannot see each other's posts
- Cannot send messages
- Cannot send friend requests
- Removed from friends (if applicable)
- Cannot view profiles

**UI Locations:**
- Profile menu → Block
- Settings → Privacy → Blocked Users

**Acceptance Criteria:**
- [ ] Can block users
- [ ] Blocked users list viewable
- [ ] Can unblock users
- [ ] Content from blocked users hidden
- [ ] Interactions prevented
- [ ] Friend relationship severed

---

### PROFILE-003: Account Settings Implementation
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** None

**Description:**
Implement account management settings.

**Technical Requirements:**
- Update `src/screens/Settings/AccountSettings.tsx`
- Add account info editing
- Add password change
- Add email change
- Add account deletion

**Features:**
```typescript
// Account info
- Edit email
- Change password
- Phone number (add/verify)
- Two-factor authentication

// Account management
- Download data
- Deactivate account
- Delete account
```

**API Endpoints:**
```typescript
PUT    /users/me/email
PUT    /users/me/password
POST   /users/me/verify-phone
POST   /users/me/2fa/enable
POST   /users/me/deactivate
DELETE /users/me
GET    /users/me/data-export
```

**Acceptance Criteria:**
- [ ] Can change email
- [ ] Can change password
- [ ] Email verification works
- [ ] Account deactivation works
- [ ] Account deletion works (with confirmation)
- [ ] Data export works

---

### PROFILE-004: Profile Customization
**Priority:** P2 (Medium)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Add more profile customization options.

**Technical Requirements:**
- Create EditProfile screen
- Add cover photo
- Add bio with rich text
- Add custom fields (website, location, interests)
- Add profile themes/colors

**Customization Options:**
```typescript
interface ProfileCustomization {
  coverPhoto?: string
  bio?: string // Rich text, max 500 chars
  website?: string
  location?: string
  interests?: Interest[]
  birthday?: Date
  showBirthday?: 'public' | 'friends' | 'private'
  themeColor?: string

  // Custom links
  socialLinks?: {
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}
```

**Acceptance Criteria:**
- [ ] Can upload cover photo
- [ ] Can edit bio with formatting
- [ ] Can add custom fields
- [ ] Can select theme color
- [ ] Can add social links
- [ ] Changes save successfully
- [ ] Profile displays customizations

---

## Epic 7: Community Management Enhancement

### Overview
Enhance community management with roles, moderation, invitations, and bans.

### User Stories
- As a community admin, I want to assign roles to members
- As a community admin, I want to ban disruptive users
- As a community admin, I want to invite users to my community
- As a community admin, I want to approve join requests
- As a user, I want to report inappropriate content

---

### COMM-001: Community Roles System
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** None

**Description:**
Implement role-based permissions for communities.

**Technical Requirements:**
- Extend communities-api-slice
- Add role management endpoints
- Implement permission checks
- Update UI to show roles

**Roles & Permissions:**
```typescript
enum CommunityRole {
  CREATOR = 'creator',      // Full control
  ADMIN = 'admin',          // Manage members, settings, posts
  MODERATOR = 'moderator',  // Manage posts, reports
  MEMBER = 'member',        // Post, comment
}

interface CommunityPermissions {
  canManageMembers: boolean
  canManageRoles: boolean
  canManageSettings: boolean
  canDeletePosts: boolean
  canBanUsers: boolean
  canInviteUsers: boolean
  canApproveMembers: boolean
  canPinPosts: boolean
  canCreateAnnouncements: boolean
}

// Permission matrix
const ROLE_PERMISSIONS: Record<CommunityRole, CommunityPermissions>
```

**API Endpoints:**
```typescript
PUT    /communities/:id/members/:userId/role  // Update member role
GET    /communities/:id/roles                 // Get role list
```

**Acceptance Criteria:**
- [ ] Roles assigned correctly
- [ ] Permissions enforced
- [ ] UI shows role badges
- [ ] Only admins can assign roles
- [ ] Creator role cannot be changed

---

### COMM-002: Community Member Management
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** COMM-001

**Description:**
Enhance MembersTab with full management capabilities.

**Technical Requirements:**
- Update `src/screens/Communities/tabs/MembersTab.tsx`
- Add role assignment UI
- Add remove member
- Add ban member
- Add member search/filter
- Show member stats

**Features:**
- View all members
- Filter by role
- Search members
- Assign/change roles (if admin)
- Remove members (if admin)
- Ban members (if admin)

**UI Components:**
- MemberItem (with role badge)
- MemberActions (bottom sheet)
- RoleSelector
- BanDialog

**Acceptance Criteria:**
- [ ] All members listed
- [ ] Can filter by role
- [ ] Can search members
- [ ] Can assign roles (admin only)
- [ ] Can remove members (admin only)
- [ ] Can ban members (admin only)
- [ ] Role badges visible

---

### COMM-003: Ban/Unban System
**Priority:** P0 (Critical)
**Estimated Effort:** 5 points
**Dependencies:** COMM-001

**Description:**
Implement user banning in communities.

**Technical Requirements:**
- Create ban management system
- Track banned users
- Prevent banned users from accessing community
- Add unban functionality
- Add ban duration options

**API Endpoints:**
```typescript
POST   /communities/:id/bans               // Ban user
DELETE /communities/:id/bans/:userId       // Unban user
GET    /communities/:id/bans               // List banned users
```

**Types:**
```typescript
interface CommunityBan {
  id: string
  communityId: string
  userId: string
  bannedBy: string
  reason?: string
  expiresAt?: string // null = permanent
  createdAt: string
  user: User
  bannedByUser: User
}
```

**Ban Effects:**
- User removed from community
- Cannot view community posts
- Cannot rejoin (until unbanned)
- Cannot be invited

**UI:**
- Banned users list in settings
- Unban button
- Ban reason display
- Ban duration display

**Acceptance Criteria:**
- [ ] Can ban users with reason
- [ ] Can set ban duration
- [ ] Banned users list viewable
- [ ] Can unban users
- [ ] Banned users cannot access community
- [ ] Notification sent to banned user

---

### COMM-004: Community Invitations
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** COMM-001

**Description:**
Implement community invitation system.

**Technical Requirements:**
- Create invitation system
- Send invitations
- Accept/decline invitations
- Track invitation status

**API Endpoints:**
```typescript
POST   /communities/:id/invitations        // Send invitation
GET    /communities/:id/invitations        // List sent invitations
GET    /users/me/community-invitations     // Get received invitations
PUT    /community-invitations/:id/accept   // Accept invitation
PUT    /community-invitations/:id/decline  // Decline invitation
DELETE /community-invitations/:id          // Cancel invitation
```

**Types:**
```typescript
interface CommunityInvitation {
  id: string
  communityId: string
  community: CommunityInterface
  invitedBy: string
  invitedUser: string
  status: 'pending' | 'accepted' | 'declined' | 'cancelled'
  message?: string
  createdAt: string
  expiresAt?: string
}
```

**Features:**
- Invite users to community
- Send personal message with invitation
- View sent invitations
- Cancel sent invitations
- Receive/view invitations
- Accept/decline invitations

**UI:**
- Invite members screen
- User search with checkboxes
- Personal message input
- Invitations tab (existing, needs wiring)

**Acceptance Criteria:**
- [ ] Can search and invite users
- [ ] Invitation notification sent
- [ ] Can view sent invitations
- [ ] Can cancel invitations
- [ ] Can accept invitations
- [ ] Can decline invitations
- [ ] Only permitted roles can invite

---

### COMM-005: Join Request System
**Priority:** P1 (High)
**Estimated Effort:** 5 points
**Dependencies:** COMM-001

**Description:**
Implement join request approval for private communities.

**Technical Requirements:**
- Create join request system
- Request to join
- Approve/decline requests
- View pending requests

**API Endpoints:**
```typescript
POST   /communities/:id/join-requests      // Request to join
GET    /communities/:id/join-requests      // List requests (admin)
PUT    /join-requests/:id/approve          // Approve request
PUT    /join-requests/:id/decline          // Decline request
DELETE /join-requests/:id                  // Cancel request
```

**Types:**
```typescript
interface CommunityJoinRequest {
  id: string
  communityId: string
  userId: string
  message?: string
  status: 'pending' | 'approved' | 'declined' | 'cancelled'
  createdAt: string
  user: User
}
```

**Flow:**
1. User requests to join private community
2. Admin receives notification
3. Admin approves/declines
4. User notified of decision

**UI:**
- "Request to Join" button on private communities
- Join requests tab in community settings
- Approve/decline actions

**Acceptance Criteria:**
- [ ] Can request to join private community
- [ ] Admin receives notification
- [ ] Admin can view requests
- [ ] Admin can approve requests
- [ ] Admin can decline requests
- [ ] User notified of decision
- [ ] Approved user added to community

---

### COMM-006: Community Settings Enhancement
**Priority:** P1 (High)
**Estimated Effort:** 3 points
**Dependencies:** COMM-001, COMM-002, COMM-003

**Description:**
Wire up and enhance the SettingsTab with real functionality.

**Technical Requirements:**
- Update `src/screens/Communities/tabs/SettingsTab.tsx`
- Connect all settings to API
- Add role-based visibility
- Add admin-only sections

**Settings Sections:**
```typescript
// General (all members)
- Community info
- Notification preferences
- Leave community

// Admin Only
- Edit community details
- Privacy settings
- Member approval settings
- Moderation tools
- Banned users
- Delete community (creator only)
```

**Acceptance Criteria:**
- [ ] All settings functional
- [ ] Role-based visibility works
- [ ] Community info editable (admin)
- [ ] Privacy settings work (admin)
- [ ] Banned users manageable (admin)
- [ ] Leave community works
- [ ] Delete community works (creator)

---

### COMM-007: Content Moderation & Reporting
**Priority:** P2 (Medium)
**Estimated Effort:** 8 points
**Dependencies:** COMM-001

**Description:**
Implement content reporting and moderation tools.

**Technical Requirements:**
- Create report system
- Report posts/comments
- Review reported content
- Take moderation actions

**API Endpoints:**
```typescript
POST   /reports                            // Submit report
GET    /communities/:id/reports            // Get reports (moderator)
PUT    /reports/:id/resolve                // Resolve report
DELETE /posts/:id                          // Delete post (moderator)
```

**Types:**
```typescript
interface Report {
  id: string
  reporterId: string
  targetType: 'post' | 'comment' | 'user'
  targetId: string
  reason: ReportReason
  description?: string
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed'
  resolvedBy?: string
  resolvedAt?: string
  createdAt: string
}

enum ReportReason {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  VIOLENCE = 'violence',
  MISINFORMATION = 'misinformation',
  OTHER = 'other',
}
```

**Features:**
- Report posts/comments/users
- View reported content (moderator)
- Delete violating content
- Ban violating users
- Dismiss false reports
- Track reporter history

**UI:**
- Report button in post/comment menu
- Report dialog
- Moderation queue screen
- Report review screen

**Acceptance Criteria:**
- [ ] Can report content
- [ ] Moderators see reports
- [ ] Can delete reported content
- [ ] Can ban offending users
- [ ] Can dismiss reports
- [ ] Reporter notified of outcome

---

## Implementation Priorities

### Phase 1: Foundation (Sprint 1-2) - 4 weeks
**Goal:** Core social features and infrastructure

**P0 Tickets (Must Have):**
- CHAT-001: Chat API Slice
- CHAT-002: WebSocket Integration
- FRIEND-001: Friend API Slice
- NOTIF-001: Notification API Slice
- NOTIF-002: Push Notification Setup
- COMM-001: Community Roles System

**Deliverables:**
- Working real-time chat
- Friend request system functional
- Push notifications enabled
- Community roles established

---

### Phase 2: User Engagement (Sprint 3-4) - 4 weeks
**Goal:** Enable users to connect and interact

**P0/P1 Tickets:**
- CHAT-003: Chat List Screen
- CHAT-004: Message Screen
- FRIEND-002: Friend Requests Screen
- FRIEND-003: Friends List Screen
- FRIEND-004: Connection Status Integration
- NOTIF-003: Notification Center
- NOTIF-004: Notification Badge Integration
- COMM-002: Community Member Management
- COMM-003: Ban/Unban System

**Deliverables:**
- Fully functional messaging
- Complete friend system
- Working notification center
- Community moderation tools

---

### Phase 3: Advanced Features (Sprint 5-6) - 4 weeks
**Goal:** Advanced social and community features

**P1 Tickets:**
- CHAT-005: Group Chat Management
- CHAT-006: Media Sharing
- FOLLOW-001: Follow API Slice
- FOLLOW-002: Followers/Following Enhancement
- FOLLOW-003: Follow Button Component
- COMM-004: Community Invitations
- COMM-005: Join Request System
- FORUM-001: Forum API Slice
- FORUM-002: Forums List Screen

**Deliverables:**
- Group chats working
- Follow system complete
- Community invitations
- Forum foundation

---

### Phase 4: Content & Privacy (Sprint 7-8) - 4 weeks
**Goal:** Forums, privacy controls, and polish

**P1/P2 Tickets:**
- FORUM-003: Forum Detail Screen
- FORUM-004: Topic Detail Screen
- FORUM-005: Create Topic Screen
- PROFILE-001: Privacy Settings
- PROFILE-002: Block User Functionality
- PROFILE-003: Account Settings
- NOTIF-005: Notification Settings
- NOTIF-006: Real-Time Updates
- COMM-006: Community Settings Enhancement

**Deliverables:**
- Complete forum system
- Privacy controls
- Enhanced settings
- Real-time notifications

---

### Phase 5: Polish & Optimization (Sprint 9-10) - 4 weeks
**Goal:** Refinements, additional features, and optimization

**P2 Tickets:**
- CHAT-007: Chat Navigation
- FRIEND-005: Friend Suggestions
- FRIEND-006: Find Friends Enhancement
- FOLLOW-004: Follow Feed
- FORUM-006: Forum Navigation
- NOTIF-007: Profile Visit Tracking
- PROFILE-004: Profile Customization
- COMM-007: Content Moderation

**Deliverables:**
- Navigation improvements
- Friend suggestions
- Content moderation
- Profile customization
- Performance optimization

---

## Technical Dependencies

### Backend API Requirements
All features require corresponding backend API endpoints. Coordinate with backend team on:

1. **Authentication & Authorization**
   - JWT token refresh
   - Role-based access control
   - Permission checking middleware

2. **Real-Time Services**
   - WebSocket server (Socket.io or similar)
   - Push notification service (FCM/APNs)
   - Redis for real-time data

3. **Database Schema Updates**
   - Friend requests & friendships tables
   - Follow relationships table
   - Notifications table
   - Community roles & bans tables
   - Forum tables (forums, topics, replies)
   - Reports table
   - Device tokens table

4. **File Upload**
   - S3 or similar for media storage
   - Image processing (thumbnails, compression)
   - Video processing

5. **Background Jobs**
   - Notification delivery
   - Email sending
   - Data exports
   - Analytics

---

### Frontend Dependencies

1. **New NPM Packages Needed**
```json
{
  "dependencies": {
    "@react-native-community/push-notification-ios": "^1.11.0",
    "react-native-gifted-chat": "^2.4.0",
    "react-native-image-picker": "^5.7.0",
    "react-native-video": "^5.2.1",
    "react-native-document-picker": "^9.1.1",
    "socket.io-client": "^4.6.1",
    "@notifee/react-native": "^7.8.0",
    "react-native-render-html": "^6.3.4"
  }
}
```

2. **Environment Variables**
```bash
EXPO_PUBLIC_WEBSOCKET_URL=wss://your-api.com/ws
EXPO_PUBLIC_PUSH_NOTIFICATION_KEY=your-key
```

3. **EAS Configuration Updates**
```json
// app.json additions
{
  "expo": {
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#ffffff",
      "androidMode": "default",
      "androidCollapsedTitle": "{{unread_count}} new notifications"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

---

## Success Metrics

### Key Performance Indicators (KPIs)

**Engagement Metrics:**
- Daily Active Users (DAU)
- Messages sent per day
- Friend connections made per week
- Community posts per day
- Average session duration
- Notification open rate

**Feature Adoption:**
- % users who enable chat
- % users with 5+ friends
- % users following others
- % users in communities
- % users participating in forums

**Quality Metrics:**
- Message delivery success rate (>99%)
- Notification delivery time (<5 seconds)
- App crash rate (<0.1%)
- API response time (<200ms p95)

---

## Risk Assessment

### High Risk Items
1. **WebSocket Scalability** - Real-time features may struggle under load
   - Mitigation: Load testing, Redis pub/sub, horizontal scaling

2. **Push Notification Delivery** - Platform-specific issues
   - Mitigation: Fallback to in-app notifications, monitoring

3. **Content Moderation** - Overwhelming volume of reports
   - Mitigation: Auto-moderation, clear guidelines, moderator tools

### Medium Risk Items
1. **Privacy Compliance** - GDPR/CCPA requirements
   - Mitigation: Privacy settings, data export, account deletion

2. **Performance** - Large friend/follower lists
   - Mitigation: Pagination, virtualized lists, caching

---

## Next Steps

1. **Review & Approval**
   - Review this roadmap with team
   - Prioritize tickets based on business goals
   - Adjust timeline as needed

2. **Backend Coordination**
   - Share API requirements with backend team
   - Establish API contract
   - Set up development environment

3. **Design Review**
   - Create mockups for new screens
   - Review UI/UX with design team
   - Establish design system components

4. **Sprint Planning**
   - Break down Phase 1 into sprint-sized chunks
   - Assign tickets to developers
   - Set up project board (GitHub Projects, Jira, etc.)

5. **Development Setup**
   - Install required dependencies
   - Configure WebSocket connection
   - Set up push notifications (dev environment)
   - Create base components and structures

---

## Appendix

### Naming Conventions
- **Tickets:** `EPIC-###` (e.g., CHAT-001, FRIEND-002)
- **Branches:** `feature/TICKET-description` (e.g., `feature/CHAT-001-api-slice`)
- **PRs:** `[TICKET] Description` (e.g., `[CHAT-001] Add chat API slice`)

### Documentation
Each epic should maintain:
- API documentation (endpoints, types)
- Component documentation (props, usage)
- Testing guidelines
- Migration guides (if applicable)

### Testing Strategy
- Unit tests for utility functions and hooks
- Integration tests for API slices
- E2E tests for critical user flows
- Manual testing checklist per ticket

---

**End of Roadmap**

This roadmap is a living document and should be updated as priorities change or new requirements emerge.
