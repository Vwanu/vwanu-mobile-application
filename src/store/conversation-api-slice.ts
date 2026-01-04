import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import {
  Conversation,
  Message,
  PaginatedResponse,
  EntityCreate,
} from '../../types'

// ============================================================================
// Types for API requests/responses
// ============================================================================

export interface FetchConversationsParams {
  page?: number
  limit?: number
  type?: 'direct' | 'group'
}

export interface CreateDirectConversationParams {
  userId: string // The user to start a conversation with
}

export interface CreateGroupConversationParams {
  userIds: string[] // Array of user IDs to add to the group
  groupName: string
  groupPicture?: string
}

export interface UpdateGroupConversationParams {
  conversationId: string
  groupName?: string
  groupPicture?: string
}

export interface FetchMessagesParams {
  conversationId: string
  page?: number
  limit?: number
}

export interface CreateMessageParams {
  conversationId: string
  messageText: string
}

export interface UpdateMessageParams {
  conversationId: string
  messageId: string
  content: string
}

export interface DeleteMessageParams {
  conversationId: string
  messageId: string
}

// ============================================================================
// Conversation API Slice
// ============================================================================

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // Conversation Endpoints
    // ========================================================================

    /**
     * Fetch all conversations for the current user
     * GET /conversation
     */
    fetchConversations: builder.query<
      PaginatedResponse<Conversation>,
      FetchConversationsParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string> = {}

        if (params?.page) {
          queryParams.page = String(params.page)
        }
        if (params?.limit) {
          queryParams.limit = String(params.limit)
        }
        if (params?.type) {
          queryParams.type = params.type
        }

        return {
          url: '/conversation',
          params: queryParams,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Conversation' as const,
                id,
              })),
              { type: 'Conversation', id: 'LIST' },
            ]
          : [{ type: 'Conversation', id: 'LIST' }],
    }),

    /**
     * Fetch a single conversation by ID
     * GET /conversation/:id
     */
    fetchConversation: builder.query<Conversation, string>({
      query: (conversationId) => ({
        url: `/conversation/${conversationId}`,
      }),
      providesTags: (_result, _error, conversationId) => [
        { type: 'Conversation', id: conversationId },
      ],
    }),

    /**
     * Create a direct (1-on-1) conversation
     * POST /conversation
     */
    createDirectConversation: builder.mutation<
      EntityCreate<Conversation>,
      CreateDirectConversationParams
    >({
      query: (params) => ({
        url: '/conversation',
        method: HttpMethods.POST,
        body: {
          type: 'direct',
          userId: params.userId,
        },
      }),
      invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],
    }),

    /**
     * Create a group conversation
     * POST /conversation
     */
    createGroupConversation: builder.mutation<
      EntityCreate<Conversation>,
      CreateGroupConversationParams
    >({
      query: (params) => ({
        url: '/conversation',
        method: HttpMethods.POST,
        body: {
          type: 'group',
          userIds: params.userIds,
          groupName: params.groupName,
          groupPicture: params.groupPicture,
        },
      }),
      invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],
    }),

    /**
     * Update a group conversation (name, picture)
     * PATCH /conversation/:id
     */
    updateGroupConversation: builder.mutation<
      EntityCreate<Conversation>,
      UpdateGroupConversationParams
    >({
      query: ({ conversationId, ...body }) => ({
        url: `/conversation/${conversationId}`,
        method: HttpMethods.PATCH,
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),

    /**
     * Delete a conversation
     * DELETE /conversation/:id
     */
    deleteConversation: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/conversation/${conversationId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (_result, _error, conversationId) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),

    // ========================================================================
    // Message Endpoints
    // ========================================================================

    /**
     * Fetch messages for a conversation
     * GET /conversation/:id/message
     */
    fetchMessages: builder.query<
      PaginatedResponse<Message>,
      FetchMessagesParams
    >({
      query: ({ conversationId, page, limit }) => {
        const queryParams: Record<string, string> = {}

        if (page) {
          queryParams.page = String(page)
        }
        if (limit) {
          queryParams.limit = String(limit)
        }

        return {
          url: `/conversation/${conversationId}/messages`,
          params: queryParams,
        }
      },
      providesTags: (result, _error, { conversationId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Message' as const,
                id,
              })),
              { type: 'Message', id: `LIST-${conversationId}` },
            ]
          : [{ type: 'Message', id: `LIST-${conversationId}` }],
    }),

    /**
     * Create a new message in a conversation
     * POST /conversation/:id/message
     */
    createMessage: builder.mutation<Message, CreateMessageParams>({
      query: ({ conversationId, messageText }) => ({
        url: `/conversation/${conversationId}/messages`,
        method: HttpMethods.POST,
        body: { messageText },
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Message', id: `LIST-${conversationId}` },
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' }, // Update last message in list
      ],
    }),

    /**
     * Update a message
     * PATCH /conversation/:conversationId/message/:messageId
     */
    updateMessage: builder.mutation<Message, UpdateMessageParams>({
      query: ({ conversationId, messageId, content }) => ({
        url: `/conversation/${conversationId}/message/${messageId}`,
        method: HttpMethods.PATCH,
        body: { content },
      }),
      invalidatesTags: (_result, _error, { conversationId, messageId }) => [
        { type: 'Message', id: messageId },
        { type: 'Message', id: `LIST-${conversationId}` },
      ],
    }),

    /**
     * Delete a message
     * DELETE /conversation/:conversationId/message/:messageId
     */
    deleteMessage: builder.mutation<void, DeleteMessageParams>({
      query: ({ conversationId, messageId }) => ({
        url: `/conversation/${conversationId}/message/${messageId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (_result, _error, { conversationId, messageId }) => [
        { type: 'Message', id: messageId },
        { type: 'Message', id: `LIST-${conversationId}` },
        { type: 'Conversation', id: conversationId }, // Update last message
      ],
    }),
  }),
})

// Export hooks for usage in components
export const {
  // Conversation hooks
  useFetchConversationsQuery,
  useFetchConversationQuery,
  useCreateDirectConversationMutation,
  useCreateGroupConversationMutation,
  useUpdateGroupConversationMutation,
  useDeleteConversationMutation,
  // Message hooks
  useFetchMessagesQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = conversationApiSlice
