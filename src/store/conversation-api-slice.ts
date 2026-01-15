import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import { WebSocketManagerFeathers } from '../services/websocket-manager-feathers'
import {
  Conversation,
  Message,
  PaginatedResponse,
  EntityCreate,
  User,
} from '../../types'
import { drawerConfig } from 'navigation/config/navigationConfig'

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
  user: User // The sender of the message
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

export interface MarkMessageAsReadParams {
  conversationId: string
  messageId: string
}

export interface MarkMessageAsDeliveredParams {
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

      // Streaming updates via WebSocket
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // Wait for initial data to be loaded
        try {
          await cacheDataLoaded
        } catch {
          // If cacheDataLoaded rejected, don't proceed
          return
        }

        // Subscribe to conversation created events
        const unsubscribeCreated =
          WebSocketManagerFeathers.subscribeToService<Conversation>(
            `conversation`,
            'created',
            (newConversation) => {
              console.log('New conversation created:', newConversation)
              updateCachedData((draft) => {
                const existingConversation = draft.data.find(
                  (c) => c.id === newConversation.id
                )
                if (!existingConversation) {
                  draft.data.unshift(newConversation)
                  // invalidate the 'LIST' tag to refetch the conversations
                  //   dispatch(apiSlice.util.invalidateTags([{ type: 'Conversation', id: 'LIST' }]))
                }
              })
            }
          )

        // Subscribe to conversation patched events (last message updates, etc.)
        const unsubscribePatched =
          WebSocketManagerFeathers.subscribeToService<Conversation>(
            'conversation',
            'patched',
            (updatedConversation) => {
              updateCachedData((draft) => {
                // const index = draft.data.findIndex(
                //   (c) => c.id === updatedConversation.id
                // )
                // if (index !== -1)
                //   draft.data[index] = updatedConversation
                dispatch(
                  apiSlice.util.invalidateTags([
                    { type: 'Conversation', id: updatedConversation.id },
                  ])
                )
              })
            }
          )

        // Subscribe to conversation removed events
        const unsubscribeRemoved =
          WebSocketManagerFeathers.subscribeToService<Conversation>(
            'conversation',
            'removed',
            (deletedConversation) => {
              updateCachedData((draft) => {
                draft.data = draft.data.filter(
                  (c) => c.id !== deletedConversation.id
                )
              })
            }
          )

        // Cleanup subscriptions when cache entry is removed
        await cacheEntryRemoved
        unsubscribeCreated()
        unsubscribePatched()
        unsubscribeRemoved()
      },
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
        const queryParams: Record<string, string> = {
          '$sort[createdAt]': '-1', // Fetch newest messages first (descending order)
        }

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
      // Transform response to reverse the order so oldest messages appear first in UI
      transformResponse: (response: PaginatedResponse<Message>) => ({
        ...response,
        data: [...response.data].reverse(),
      }),
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

      // Streaming updates via WebSocket
      async onCacheEntryAdded(
        { conversationId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // Wait for initial data to be loaded
        try {
          await cacheDataLoaded
        } catch {
          // If cacheDataLoaded rejected, don't proceed
          return
        }

        //    WebSocketManagerFeathers.subscribeToAllServiceEvents()
        // Subscribe to 'messages' service 'created' event
        const unsubscribeCreated =
          WebSocketManagerFeathers.subscribeToService<Message>(
            'conversation/:conversationId/messages',
            'created',
            (newMessage) => {
              // Only update if message belongs to this conversation
              if (newMessage.conversationId === conversationId) {
                updateCachedData((draft) => {
                  const exists = draft.data.some((m) => m.id === newMessage.id)
                  if (!exists) {
                    // Remove temp messages and add the new message
                    draft.data = draft.data.filter(
                      (m) => !m.id.startsWith('temp-')
                    )
                    draft.data.push(newMessage)

                    // Mark the message as delivered (only for messages from others)
                    dispatch(
                      conversationApiSlice.endpoints.markMessageAsDelivered.initiate(
                        {
                          conversationId,
                          messageId: newMessage.id,
                        }
                      )
                    )
                  }
                })
              }
            }
          )

        // Subscribe to 'patched' for message updates
        const unsubscribePatched =
          WebSocketManagerFeathers.subscribeToService<Message>(
            'conversation/:conversationId/messages',
            'patched',
            (updatedMessage) => {
              if (updatedMessage.conversationId === conversationId) {
                updateCachedData((draft) => {
                  const index = draft.data.findIndex(
                    (m) => m.id === updatedMessage.id
                  )
                  if (index !== -1) {
                    draft.data[index] = updatedMessage
                  }
                })
              }
            }
          )

        // Subscribe to 'removed' for message deletions
        const unsubscribeRemoved =
          WebSocketManagerFeathers.subscribeToService<Message>(
            'messages',
            'removed',
            (deletedMessage) => {
              if (deletedMessage.conversationId === conversationId) {
                updateCachedData((draft) => {
                  draft.data = draft.data.filter(
                    (m) => m.id !== deletedMessage.id
                  )
                })
              }
            }
          )

        // Cleanup subscriptions when cache entry is removed
        await cacheEntryRemoved
        unsubscribeCreated()
        unsubscribePatched()
        unsubscribeRemoved()
      },
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
      // Don't invalidate Message list - optimistic update + WebSocket handles it
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' }, // Update last message in list
      ],

      async onQueryStarted(
        { conversationId, messageText, user },
        { dispatch, queryFulfilled }
      ) {
        // Create optimistic message with temporary ID
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          conversationId,
          messageText,
          createdAt: new Date().toISOString(),
          user,
          readDate: '',
        }

        // Optimistically add the message to the cache
        const patchResult = dispatch(
          conversationApiSlice.util.updateQueryData(
            'fetchMessages',
            { conversationId },
            (draft) => {
              draft.data.push(optimisticMessage)
            }
          )
        )

        try {
          // Wait for the mutation to complete
          const { data: serverMessage } = await queryFulfilled
          // Replace the optimistic message with the actual message from server
          dispatch(
            conversationApiSlice.util.updateQueryData(
              'fetchMessages',
              { conversationId },
              (draft) => {
                const index = draft.data.findIndex(
                  (m) => m.id === optimisticMessage.id
                )
                if (index !== -1) {
                  draft.data[index] = serverMessage
                }
              }
            )
          )
          console.log(
            '✅ Message sent successfully, updated cache with server message.'
          )
        } catch (error) {
          console.log('❌ Error sending message, reverting:', error)
          // Revert optimistic update on error
          patchResult.undo()
        }
      },
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

    /**
     * Mark a message as read/viewed
     * PATCH /conversation/:conversationId/messages/:messageId
     */
    markMessageAsRead: builder.mutation<Message, MarkMessageAsReadParams>({
      query: ({ conversationId, messageId }) => ({
        url: `/conversation/${conversationId}/messages/${messageId}`,
        method: HttpMethods.PATCH,
        body: { isRead: true },
      }),
      // No invalidation needed - just a silent update
    }),

    /**
     * Mark a message as delivered
     * PATCH /conversation/:conversationId/messages/:messageId
     */
    markMessageAsDelivered: builder.mutation<
      Message,
      MarkMessageAsDeliveredParams
    >({
      query: ({ conversationId, messageId }) => ({
        url: `/conversation/${conversationId}/messages/${messageId}`,
        method: HttpMethods.PATCH,
        body: { isDelivered: true },
      }),
      // No invalidation needed - just a silent update
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
  useMarkMessageAsReadMutation,
  useMarkMessageAsDeliveredMutation,
} = conversationApiSlice
