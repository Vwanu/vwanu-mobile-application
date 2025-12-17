# Vwanu Application - System Design Document

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [API Design](#api-design)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [Real-Time Communication](#real-time-communication)
10. [Security Architecture](#security-architecture)
11. [Scalability & Performance](#scalability--performance)
12. [Deployment Architecture](#deployment-architecture)

---

## Overview

### System Purpose

Vwanu is a comprehensive social networking mobile application built with React Native and Expo, designed to enable users to:
- Connect with friends and build communities
- Engage in real-time chat conversations
- Participate in topic-based forums
- Share content and interests
- Manage privacy and moderation

### Design Principles

1. **Mobile-First:** Optimized for iOS and Android with responsive design
2. **Real-Time:** Live updates for messages, notifications, and social interactions
3. **Secure:** End-to-end encryption, secure authentication, privacy controls
4. **Scalable:** Designed to handle growth from 1K to 1M+ users
5. **Maintainable:** Clean architecture, well-documented, testable code

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Native App<br/>iOS/Android]
        B[Expo SDK]
        C[Redux Store<br/>RTK Query]
    end

    subgraph "API Gateway Layer"
        D[AWS API Gateway]
        E[WebSocket Gateway]
    end

    subgraph "Application Layer"
        F[REST API Server<br/>Node.js/Express]
        G[WebSocket Server<br/>Socket.io]
        H[Authentication Service<br/>AWS Cognito]
    end

    subgraph "Business Logic Layer"
        I[Chat Service]
        J[Social Service<br/>Friends/Follow]
        K[Community Service]
        L[Forum Service]
        M[Notification Service]
    end

    subgraph "Data Layer"
        N[(PostgreSQL<br/>Primary DB)]
        O[(Redis Cache<br/>Sessions)]
        P[S3 Bucket<br/>Media Storage]
        Q[ElasticSearch<br/>Search Index]
    end

    subgraph "External Services"
        R[Expo Push<br/>Notifications]
        S[AWS SES<br/>Email Service]
        T[CloudFront CDN]
    end

    A --> B --> C
    C --> D
    C --> E
    D --> F
    E --> G
    F --> H
    G --> H

    F --> I
    F --> J
    F --> K
    F --> L
    F --> M

    I --> N
    J --> N
    K --> N
    L --> N
    M --> N

    I --> O
    G --> O
    M --> O

    F --> P
    F --> Q

    M --> R
    M --> S
    P --> T
```

### Architecture Layers

#### 1. **Client Layer**
- **React Native App:** Cross-platform mobile application
- **Expo SDK:** Development framework and build tools
- **Redux Store:** Global state management with RTK Query

#### 2. **API Gateway Layer**
- **AWS API Gateway:** HTTP API routing and rate limiting
- **WebSocket Gateway:** Real-time bidirectional communication

#### 3. **Application Layer**
- **REST API Server:** Node.js/Express handling HTTP requests
- **WebSocket Server:** Socket.io for real-time features
- **AWS Cognito:** User authentication and session management

#### 4. **Business Logic Layer**
- **Microservices pattern** for each major feature domain
- **Service-oriented architecture** for modularity and scalability

#### 5. **Data Layer**
- **PostgreSQL:** Relational data storage
- **Redis:** Caching and session storage
- **S3:** Media file storage
- **ElasticSearch:** Full-text search capabilities

---

## Technology Stack

### Frontend (Mobile)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React Native | 0.76.9 | Cross-platform mobile development |
| **Build Tool** | Expo | 52.0.11 | Development and build infrastructure |
| **Language** | TypeScript | 5.3.3 | Type-safe JavaScript |
| **State Management** | Redux Toolkit | 1.8.3 | Global state management |
| **API Client** | RTK Query | - | Data fetching and caching |
| **Navigation** | React Navigation | 6.x | App navigation |
| **UI Framework** | UI Kitten | 5.1.2 | Component library |
| **Styling** | Tailwind (twrnc) | 3.3.3 | Utility-first CSS |
| **Forms** | Formik + Yup | Latest | Form handling and validation |
| **Real-Time** | Socket.io Client | Latest | WebSocket communication |
| **Authentication** | AWS Amplify | 6.12.3 | Auth integration |

### Backend (Server)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 18.x LTS | Server runtime |
| **Framework** | Express.js | Latest | REST API framework |
| **Language** | TypeScript | 5.x | Type-safe backend |
| **WebSocket** | Socket.io | Latest | Real-time communication |
| **Authentication** | AWS Cognito | - | User management |
| **ORM** | Prisma / TypeORM | Latest | Database ORM |
| **Validation** | Joi / Zod | Latest | Request validation |
| **Testing** | Jest + Supertest | Latest | Unit and integration tests |

### Database & Storage

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Primary DB** | PostgreSQL 14+ | Relational data storage |
| **Cache** | Redis 7+ | Session storage, rate limiting |
| **Object Storage** | AWS S3 | Media files (images, videos) |
| **Search Engine** | ElasticSearch 8+ | Full-text search |
| **CDN** | AWS CloudFront | Content delivery |

### Infrastructure & DevOps

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Cloud Provider** | AWS | Infrastructure |
| **Compute** | AWS ECS / Fargate | Container orchestration |
| **Container** | Docker | Containerization |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **Monitoring** | DataDog / CloudWatch | Application monitoring |
| **Logging** | CloudWatch Logs | Centralized logging |
| **Error Tracking** | Sentry | Error monitoring |

---

## Component Architecture

### Client Architecture

```mermaid
graph TD
    subgraph "App Root"
        A[App.tsx]
        B[Navigation Router]
    end

    subgraph "State Management"
        C[Redux Store]
        D[API Slice]
        E[Auth Slice]
        F[UI Slice]
    end

    subgraph "Navigation"
        G[Drawer Navigator]
        H[Stack Navigator]
        I[Tab Navigator]
    end

    subgraph "Feature Modules"
        J[Chat Module]
        K[Social Module]
        L[Community Module]
        M[Forum Module]
        N[Profile Module]
    end

    subgraph "Shared Components"
        O[UI Components]
        P[Form Components]
        Q[Layout Components]
    end

    subgraph "Services"
        R[Auth Service]
        S[WebSocket Service]
        T[Push Notification Service]
        U[Storage Service]
    end

    A --> B
    A --> C
    B --> G
    B --> H
    B --> I

    G --> J
    G --> K
    G --> L
    G --> M
    G --> N

    J --> O
    K --> O
    L --> O

    C --> D
    C --> E
    C --> F

    D --> R
    D --> S

    J --> S
    K --> T
    N --> U
```

### Backend Architecture

```mermaid
graph TD
    subgraph "API Layer"
        A[Express App]
        B[Router Middleware]
        C[Auth Middleware]
        D[Validation Middleware]
    end

    subgraph "Controllers"
        E[Chat Controller]
        F[User Controller]
        G[Community Controller]
        H[Forum Controller]
        I[Notification Controller]
    end

    subgraph "Services"
        J[Chat Service]
        K[User Service]
        L[Community Service]
        M[Forum Service]
        N[Notification Service]
        O[WebSocket Service]
    end

    subgraph "Data Access"
        P[User Repository]
        Q[Chat Repository]
        R[Community Repository]
        S[Forum Repository]
    end

    subgraph "External Integrations"
        T[AWS Cognito]
        U[Expo Push API]
        V[AWS S3]
        W[ElasticSearch]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I

    E --> J
    F --> K
    G --> L
    H --> M
    I --> N

    J --> O
    J --> Q
    K --> P
    L --> R
    M --> S

    K --> T
    N --> U
    K --> V
    M --> W
```

---

## Data Flow Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant C as Cognito
    participant API as API Server
    participant DB as Database

    U->>A: Enter credentials
    A->>C: Sign in request
    C->>C: Validate credentials
    C-->>A: Access + ID tokens
    A->>A: Store tokens securely
    A->>API: API request + Bearer token
    API->>C: Validate token
    C-->>API: Token valid
    API->>DB: Fetch user data
    DB-->>API: User data
    API-->>A: Response with data
    A-->>U: Display content
```

### Real-Time Chat Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant A1 as App 1
    participant WS as WebSocket Server
    participant DB as Database
    participant A2 as App 2
    participant U2 as User 2

    U1->>A1: Type message
    A1->>WS: Send message
    WS->>DB: Save message
    DB-->>WS: Message saved
    WS-->>A1: Acknowledge
    WS->>A2: Broadcast message
    A2-->>U2: Display message
    A2->>WS: Mark as read
    WS->>DB: Update read status
    WS-->>A1: Read receipt
    A1-->>U1: Show read status
```

### Post Creation & Distribution Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant API as API Server
    participant S3 as S3 Storage
    participant DB as Database
    participant ES as ElasticSearch
    participant N as Notification Service

    U->>A: Create post + image
    A->>API: Upload request
    API->>S3: Store image
    S3-->>API: Image URL
    API->>DB: Save post
    DB-->>API: Post saved
    API->>ES: Index post
    API->>N: Notify followers
    N->>N: Queue notifications
    API-->>A: Success response
    A-->>U: Post published
```

### Friend Request Flow

```mermaid
sequenceDiagram
    participant U1 as User A
    participant A1 as App A
    participant API as API Server
    participant DB as Database
    participant WS as WebSocket
    participant A2 as App B
    participant U2 as User B

    U1->>A1: Send friend request
    A1->>API: POST /friend-requests
    API->>DB: Create request
    DB-->>API: Request created
    API->>WS: Notify User B
    WS->>A2: Real-time notification
    A2-->>U2: Show notification
    U2->>A2: Accept request
    A2->>API: PUT /friend-requests/:id/accept
    API->>DB: Create friendship
    API->>WS: Notify both users
    WS->>A1: Update friend list
    WS->>A2: Update friend list
```

---

## API Design

### REST API Endpoints

#### Authentication Endpoints

```typescript
// Authentication (AWS Cognito managed)
POST   /auth/sign-up                  // Register new user
POST   /auth/sign-in                  // User login
POST   /auth/sign-out                 // User logout
POST   /auth/refresh-token            // Refresh access token
POST   /auth/confirm-email            // Confirm email
POST   /auth/forgot-password          // Request password reset
POST   /auth/reset-password           // Reset password
```

#### User & Profile Endpoints

```typescript
GET    /users/me                      // Get current user profile
PUT    /users/me                      // Update profile
GET    /users/:userId                 // Get user profile
GET    /users/search                  // Search users
GET    /users/:userId/posts           // Get user's posts
POST   /users/me/avatar               // Upload avatar
POST   /users/me/cover-photo          // Upload cover photo

// Privacy & Settings
GET    /users/me/privacy-settings     // Get privacy settings
PUT    /users/me/privacy-settings     // Update privacy settings
POST   /users/:userId/block           // Block user
DELETE /users/:userId/block           // Unblock user
GET    /users/blocked                 // Get blocked users
```

#### Friend System Endpoints

```typescript
// Friend Requests
POST   /friend-requests                // Send friend request
GET    /friend-requests                // Get pending requests
GET    /friend-requests/sent          // Get sent requests
PUT    /friend-requests/:id/accept    // Accept request
PUT    /friend-requests/:id/decline   // Decline request
DELETE /friend-requests/:id            // Cancel request

// Friends
GET    /friends                        // Get friend list
DELETE /friends/:userId                // Remove friend
GET    /friends/mutual/:userId         // Get mutual friends
GET    /friends/suggestions            // Get friend suggestions
```

#### Follow System Endpoints

```typescript
POST   /users/:userId/follow           // Follow user
DELETE /users/:userId/follow           // Unfollow user
GET    /users/:userId/followers        // Get followers
GET    /users/:userId/following        // Get following
GET    /users/:userId/follow-status    // Check follow status
```

#### Chat Endpoints

```typescript
// Conversations
GET    /conversations                  // Get all conversations
POST   /conversations                  // Create conversation
GET    /conversations/:id              // Get conversation details
DELETE /conversations/:id              // Delete conversation
PUT    /conversations/:id/read         // Mark as read

// Messages
GET    /conversations/:id/messages     // Get messages
POST   /conversations/:id/messages     // Send message
PUT    /messages/:id                   // Edit message
DELETE /messages/:id                   // Delete message
POST   /messages/:id/reactions         // Add reaction
```

#### Community Endpoints

```typescript
// Communities
GET    /communities                    // List communities
POST   /communities                    // Create community
GET    /communities/:id                // Get community details
PUT    /communities/:id                // Update community
DELETE /communities/:id                // Delete community

// Community Members
GET    /communities/:id/members        // Get members
POST   /communities/:id/join           // Join community
DELETE /communities/:id/leave          // Leave community
PUT    /communities/:id/members/:userId/role  // Update role

// Community Management
POST   /communities/:id/invitations    // Send invitation
POST   /communities/:id/join-requests  // Request to join
PUT    /join-requests/:id/approve      // Approve request
POST   /communities/:id/bans           // Ban user
DELETE /communities/:id/bans/:userId   // Unban user
GET    /communities/:id/bans           // List banned users
```

#### Forum Endpoints

```typescript
// Forums
GET    /forums                         // List forums
GET    /forums/:id                     // Get forum details
POST   /forums/:id/subscribe           // Subscribe to forum

// Forum Topics
GET    /forums/:id/topics              // Get topics
POST   /forums/:id/topics              // Create topic
GET    /topics/:id                     // Get topic details
PUT    /topics/:id                     // Update topic
DELETE /topics/:id                     // Delete topic
POST   /topics/:id/pin                 // Pin topic
POST   /topics/:id/lock                // Lock topic

// Replies
GET    /topics/:id/replies             // Get replies
POST   /topics/:id/replies             // Add reply
PUT    /replies/:id                    // Edit reply
DELETE /replies/:id                    // Delete reply
POST   /replies/:id/like               // Like reply
```

#### Notification Endpoints

```typescript
GET    /notifications                  // Get notifications
GET    /notifications/unread           // Get unread count
PUT    /notifications/:id/read         // Mark as read
PUT    /notifications/read-all         // Mark all as read
DELETE /notifications/:id              // Delete notification
GET    /notifications/settings         // Get preferences
PUT    /notifications/settings         // Update preferences

// Device Tokens
POST   /users/device-tokens            // Register device
DELETE /users/device-tokens/:token     // Unregister device
```

#### Post & Feed Endpoints

```typescript
// Posts
GET    /posts                          // Get feed
POST   /posts                          // Create post
GET    /posts/:id                      // Get post details
PUT    /posts/:id                      // Update post
DELETE /posts/:id                      // Delete post

// Interactions
POST   /posts/:id/like                 // Like post
DELETE /posts/:id/like                 // Unlike post
GET    /posts/:id/likes                // Get likes
POST   /posts/:id/comments             // Comment on post
GET    /posts/:id/comments             // Get comments
PUT    /comments/:id                   // Edit comment
DELETE /comments/:id                   // Delete comment
```

### WebSocket Events

```typescript
// Connection Events
'connect'                              // Client connected
'disconnect'                           // Client disconnected
'authenticate'                         // Authenticate WebSocket

// Chat Events
'message:send'                         // Send message
'message:new'                          // New message received
'typing:start'                         // User started typing
'typing:stop'                          // User stopped typing
'message:read'                         // Message read

// Notification Events
'notification:new'                     // New notification
'notification:read'                    // Notification marked read

// Presence Events
'presence:online'                      // User came online
'presence:offline'                     // User went offline
'presence:status'                      // Status update

// Community Events
'community:update'                     // Community updated
'community:member:join'                // Member joined
'community:member:leave'               // Member left
```

### API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-01-15T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z"
}

// Paginated Response
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Database Schema

### Core Tables

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    cover_photo_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    location VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_completion_step INTEGER DEFAULT 1,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_cognito_id (cognito_id)
);
```

#### Friendships Table

```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id_1, user_id_2),
    CHECK (user_id_1 < user_id_2),  -- Ensure single direction
    INDEX idx_user_1 (user_id_1),
    INDEX idx_user_2 (user_id_2)
);

CREATE TABLE friend_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, declined
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(requester_id, addressee_id),
    INDEX idx_addressee (addressee_id),
    INDEX idx_status (status)
);
```

#### Follows Table

```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(follower_id, following_id),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id)
);
```

#### Chat Tables

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) DEFAULT 'private',  -- private, group
    name VARCHAR(255),  -- For group chats
    avatar_url TEXT,    -- For group chats
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_type (type),
    INDEX idx_updated_at (updated_at DESC)
);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    last_read_at TIMESTAMP,
    is_muted BOOLEAN DEFAULT FALSE,

    UNIQUE(conversation_id, user_id),
    INDEX idx_user (user_id),
    INDEX idx_conversation (conversation_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',  -- text, image, video, file
    media_url TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_conversation (conversation_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created_at (created_at DESC)
);

CREATE TABLE message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(message_id, user_id),
    INDEX idx_message (message_id),
    INDEX idx_user (user_id)
);
```

#### Community Tables

```sql
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_photo_url TEXT,
    privacy VARCHAR(20) DEFAULT 'public',  -- public, private
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    member_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    INDEX idx_privacy (privacy),
    INDEX idx_created_by (created_by)
);

CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',  -- creator, admin, moderator, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(community_id, user_id),
    INDEX idx_community (community_id),
    INDEX idx_user (user_id),
    INDEX idx_role (role)
);

CREATE TABLE community_bans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    banned_by UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    expires_at TIMESTAMP,  -- NULL for permanent bans
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(community_id, user_id),
    INDEX idx_expires_at (expires_at)
);

CREATE TABLE community_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES users(id),
    invited_user UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, declined
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,

    INDEX idx_invited_user (invited_user),
    INDEX idx_status (status)
);
```

#### Forum Tables

```sql
CREATE TABLE forums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    interest_id UUID,  -- Link to interests
    topic_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_interest (interest_id)
);

CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forum_id UUID NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    reply_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP,
    last_reply_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_forum (forum_id),
    INDEX idx_author (author_id),
    INDEX idx_pinned (is_pinned),
    INDEX idx_created_at (created_at DESC)
);

CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_topic (topic_id),
    INDEX idx_author (author_id),
    INDEX idx_created_at (created_at DESC)
);
```

#### Notification Tables

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- friend_request, message, post_like, etc.
    actor_id UUID REFERENCES users(id),
    target_id UUID,  -- Generic ID for related entity
    target_type VARCHAR(50),  -- Type of target (post, comment, etc.)
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at DESC)
);

CREATE TABLE device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    platform VARCHAR(20) NOT NULL,  -- ios, android
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user (user_id),
    INDEX idx_token (token)
);
```

### Database Indexes Strategy

```sql
-- Composite indexes for common queries
CREATE INDEX idx_messages_conversation_created
    ON messages(conversation_id, created_at DESC);

CREATE INDEX idx_forum_topics_forum_pinned_created
    ON forum_topics(forum_id, is_pinned DESC, created_at DESC);

CREATE INDEX idx_notifications_user_read_created
    ON notifications(user_id, is_read, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_users_fulltext
    ON users USING GIN(to_tsvector('english',
        COALESCE(first_name, '') || ' ' ||
        COALESCE(last_name, '') || ' ' ||
        COALESCE(username, '')));

CREATE INDEX idx_forum_topics_fulltext
    ON forum_topics USING GIN(to_tsvector('english',
        title || ' ' || content));
```

---

## Authentication & Authorization

### AWS Cognito Integration

```typescript
// Cognito User Pool Configuration
{
  userPoolId: 'us-east-1_xxxxxxxxx',
  clientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  region: 'us-east-1',

  // Password policy
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true
  },

  // MFA configuration
  mfa: 'OPTIONAL',  // OFF, ON, OPTIONAL
  mfaTypes: ['SMS', 'TOTP'],

  // Account recovery
  accountRecovery: {
    verifiedEmail: true,
    verifiedPhone: false
  }
}
```

### Token Management

```typescript
// Token structure
interface AuthTokens {
  accessToken: string;    // Short-lived (1 hour)
  idToken: string;        // Contains user claims
  refreshToken: string;   // Long-lived (30 days)
  expiresIn: number;      // Seconds until expiration
}

// Token storage (React Native)
import * as SecureStore from 'expo-secure-store';

class AuthTokenService {
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('idToken', tokens.idToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
  }

  static async getValidTokens(): Promise<AuthTokens | null> {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const idToken = await SecureStore.getItemAsync('idToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    // Check if access token is expired
    if (isTokenExpired(accessToken)) {
      // Attempt to refresh
      return await this.refreshTokens(refreshToken);
    }

    return { accessToken, idToken, refreshToken };
  }
}
```

### Authorization Middleware (Backend)

```typescript
// JWT verification middleware
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify with Cognito
    const decoded = await verifyJWT(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      cognitoId: decoded.sub
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Role-based authorization
function requireRole(roles: string[]) {
  return async (req, res, next) => {
    const user = req.user;
    const userRole = await getUserRole(user.id, req.params.communityId);

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage
app.delete(
  '/communities/:id/members/:userId',
  verifyToken,
  requireRole(['admin', 'creator']),
  removeMember
);
```

---

## Real-Time Communication

### WebSocket Architecture

```typescript
// Socket.io Server Setup
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  }
});

// Redis adapter for horizontal scaling
const pubClient = new Redis(process.env.REDIS_URL);
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// Authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const user = await verifyToken(token);
    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Connection handling
io.on('connection', (socket) => {
  const userId = socket.data.user.id;

  // Join user-specific room
  socket.join(`user:${userId}`);

  // Update online status
  updatePresence(userId, 'online');

  // Handle disconnection
  socket.on('disconnect', () => {
    updatePresence(userId, 'offline');
  });

  // Chat message handler
  socket.on('message:send', async (data) => {
    const message = await saveMessage(data);

    // Emit to conversation room
    io.to(`conversation:${data.conversationId}`)
      .emit('message:new', message);
  });

  // Typing indicator
  socket.on('typing:start', (conversationId) => {
    socket.to(`conversation:${conversationId}`)
      .emit('typing:start', { userId });
  });
});
```

### Room Management

```typescript
// User joins conversation
async function joinConversation(socket, conversationId) {
  // Verify user is participant
  const isParticipant = await checkParticipant(
    socket.data.user.id,
    conversationId
  );

  if (isParticipant) {
    socket.join(`conversation:${conversationId}`);
  }
}

// Community-specific rooms
async function joinCommunity(socket, communityId) {
  const isMember = await checkCommunityMember(
    socket.data.user.id,
    communityId
  );

  if (isMember) {
    socket.join(`community:${communityId}`);
  }
}
```

### Presence System

```typescript
// Redis-based presence tracking
class PresenceService {
  private redis: Redis;

  async setOnline(userId: string): Promise<void> {
    await this.redis.setex(
      `presence:${userId}`,
      300,  // 5 minutes TTL
      'online'
    );

    // Publish presence update
    await this.redis.publish(
      'presence:updates',
      JSON.stringify({ userId, status: 'online' })
    );
  }

  async getOnlineUsers(userIds: string[]): Promise<Set<string>> {
    const pipeline = this.redis.pipeline();
    userIds.forEach(id => pipeline.get(`presence:${id}`));

    const results = await pipeline.exec();
    return new Set(
      userIds.filter((_, i) => results[i][1] === 'online')
    );
  }
}
```

---

## Security Architecture

### Security Measures

#### 1. Authentication Security
- AWS Cognito for user management
- JWT tokens with short expiration (1 hour)
- Secure token storage (Expo SecureStore)
- Automatic token refresh
- MFA support (optional)

#### 2. API Security
- HTTPS only (TLS 1.3)
- Rate limiting (per user, per IP)
- Request validation (Joi/Zod)
- CORS configuration
- API key authentication for server-to-server

#### 3. Data Security
- Encryption at rest (PostgreSQL, S3)
- Encryption in transit (TLS)
- Database connection pooling with SSL
- Sensitive data hashing (bcrypt)
- PII data encryption

#### 4. Application Security
- Content Security Policy (CSP)
- XSS protection
- SQL injection prevention (parameterized queries)
- CSRF protection
- Input sanitization
- Output encoding

#### 5. File Upload Security
- File type validation
- File size limits
- Virus scanning (ClamAV)
- Signed URLs for temporary access
- CDN with access controls

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Global rate limiter
const globalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient
  }),
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: 'Too many requests, please try again later'
});

// Auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 requests per 15 minutes
  skipSuccessfulRequests: true
});

// Apply to routes
app.use('/api/', globalLimiter);
app.use('/auth/', authLimiter);
```

### Input Validation

```typescript
import Joi from 'joi';

// Message validation schema
const messageSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  conversationId: Joi.string().uuid().required(),
  messageType: Joi.string().valid('text', 'image', 'video').default('text'),
  mediaUrl: Joi.string().uri().optional()
});

// Validation middleware
function validateRequest(schema: Joi.Schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          details: error.details
        }
      });
    }

    req.body = value;
    next();
  };
}
```

---

## Scalability & Performance

### Horizontal Scaling

```yaml
# Docker Compose for multi-instance deployment
version: '3.8'

services:
  api:
    image: vwanu-api:latest
    deploy:
      replicas: 3  # Multiple API instances
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://...
    depends_on:
      - redis
      - postgres

  websocket:
    image: vwanu-websocket:latest
    deploy:
      replicas: 2  # Multiple WebSocket instances
    environment:
      - REDIS_URL=redis://redis:6379

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
      - websocket
```

### Caching Strategy

```typescript
// Multi-layer caching
class CacheService {
  private redis: Redis;

  // Cache user profile (1 hour TTL)
  async getUserProfile(userId: string): Promise<User> {
    const cacheKey = `user:${userId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await db.users.findUnique({ where: { id: userId } });
    await this.redis.setex(cacheKey, 3600, JSON.stringify(user));

    return user;
  }

  // Invalidate cache on update
  async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    await db.users.update({
      where: { id: userId },
      data
    });

    // Invalidate cache
    await this.redis.del(`user:${userId}`);
  }
}
```

### Database Optimization

```typescript
// Connection pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  max: 20,  // Maximum 20 connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Read replicas for scalability
const primaryDB = new Pool({ /* primary config */ });
const replicaDB = new Pool({ /* replica config */ });

// Route reads to replica
async function getUsers() {
  return replicaDB.query('SELECT * FROM users');
}

// Route writes to primary
async function createUser(data) {
  return primaryDB.query('INSERT INTO users ...', data);
}
```

### CDN & Asset Optimization

```typescript
// CloudFront distribution for S3 assets
const cloudfront = new CloudFrontClient({ region: 'us-east-1' });

// Generate signed URLs for private content
function getSignedUrl(key: string, expiresIn: number = 3600): string {
  const url = new URL(`https://${CDN_DOMAIN}/${key}`);
  const signer = new CloudFrontSigner({
    keyPairId: process.env.CLOUDFRONT_KEY_ID,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY
  });

  return signer.getSignedUrl({
    url: url.toString(),
    expires: Date.now() + expiresIn * 1000
  });
}

// Image optimization
async function uploadImage(file: Buffer): Promise<string> {
  // Resize and optimize
  const optimized = await sharp(file)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Upload to S3
  const key = `images/${uuidv4()}.webp`;
  await s3.putObject({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: optimized,
    ContentType: 'image/webp',
    CacheControl: 'max-age=31536000'  // 1 year
  });

  return getCDNUrl(key);
}
```

---

## Deployment Architecture

### AWS Infrastructure

```mermaid
graph TB
    subgraph "DNS"
        R53[Route 53]
    end

    subgraph "CDN"
        CF[CloudFront]
    end

    subgraph "Load Balancing"
        ALB[Application Load Balancer]
    end

    subgraph "Compute - ECS Fargate"
        API1[API Container 1]
        API2[API Container 2]
        API3[API Container 3]
        WS1[WebSocket Container 1]
        WS2[WebSocket Container 2]
    end

    subgraph "Data Layer"
        RDS[(RDS PostgreSQL<br/>Multi-AZ)]
        Redis[(ElastiCache Redis<br/>Cluster)]
        S3[(S3 Bucket<br/>Media Storage)]
    end

    subgraph "Monitoring"
        CW[CloudWatch]
        Sentry[Sentry]
    end

    R53 --> CF
    CF --> ALB
    ALB --> API1
    ALB --> API2
    ALB --> API3
    ALB --> WS1
    ALB --> WS2

    API1 --> RDS
    API2 --> RDS
    API3 --> RDS

    API1 --> Redis
    WS1 --> Redis
    WS2 --> Redis

    API1 --> S3
    S3 --> CF

    API1 --> CW
    API1 --> Sentry
```

### Environment Configuration

```bash
# Production Environment Variables
NODE_ENV=production
PORT=8080

# Database
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/vwanu
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://elasticache-endpoint:6379
REDIS_TLS=true

# AWS Cognito
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
COGNITO_REGION=us-east-1

# S3
S3_BUCKET=vwanu-media-production
S3_REGION=us-east-1

# CloudFront
CDN_DOMAIN=d1234567890.cloudfront.net

# Expo Push Notifications
EXPO_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxx

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
DATADOG_API_KEY=xxxxxxxxxxxxxxxxxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://app.vwanu.com,https://www.vwanu.com
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/login-action@v2
        with:
          registry: ${{ secrets.ECR_REGISTRY }}
          username: ${{ secrets.AWS_ACCESS_KEY_ID }}
          password: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Build and push Docker image
        run: |
          docker build -t vwanu-api:${{ github.sha }} .
          docker push ${{ secrets.ECR_REGISTRY }}/vwanu-api:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster vwanu-production \
            --service vwanu-api \
            --force-new-deployment
```

---

## Monitoring & Observability

### Metrics Collection

```typescript
// Custom metrics middleware
import StatsD from 'hot-shots';

const statsd = new StatsD({
  host: 'datadog-agent',
  port: 8125
});

// Track API response times
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    statsd.histogram('api.response_time', duration, {
      route: req.route?.path,
      method: req.method,
      status: res.statusCode
    });
  });

  next();
});

// Track business metrics
async function sendMessage(data) {
  const message = await saveMessage(data);

  // Increment message counter
  statsd.increment('messages.sent', 1, {
    conversation_type: data.type
  });

  return message;
}
```

### Error Tracking

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% of transactions
});

// Error handling middleware
app.use((error, req, res, next) => {
  // Log to Sentry
  Sentry.captureException(error, {
    user: { id: req.user?.id },
    tags: {
      route: req.route?.path,
      method: req.method
    }
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An error occurred'
    }
  });
});
```

### Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.CloudWatch({
      logGroupName: '/vwanu/api',
      logStreamName: () => {
        const date = new Date().toISOString().split('T')[0];
        return `${date}/${process.env.INSTANCE_ID}`;
      }
    })
  ]
});

// Usage
logger.info('User logged in', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

---

## Conclusion

This system design provides a scalable, secure, and maintainable architecture for the Vwanu social networking application. Key highlights:

- **Microservices-oriented backend** for modularity
- **Real-time capabilities** via WebSocket
- **Secure authentication** with AWS Cognito
- **Horizontal scalability** with Redis and load balancing
- **High availability** with multi-AZ deployment
- **Performance optimization** through caching and CDN
- **Comprehensive monitoring** with metrics and logging

The design supports the 22-week development timeline and can scale from MVP to production with millions of users.
