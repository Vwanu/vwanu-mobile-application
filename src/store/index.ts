import thunkMiddleware from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { devToolsEnhancer } from 'redux-devtools-extension'

import api_slice from './api-slice'
import { uiReducer } from './ui-slice'
import profileReducer from './profiles'
import logger from '../middleware/logger'
import authReducer, { AuthSessionService } from './auth-slice'
import { NotificationSubscriptionManager } from '../services/subscriptions'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    [api_slice.reducerPath]: api_slice.reducer,
    ui: uiReducer,
  },
  devTools: false,
  //@ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api_slice.middleware)
      .concat(logger)
      .concat(thunkMiddleware),
  // @ts-ignore
  enhancers: [devToolsEnhancer({ trace: true })],
})

// Initialize AuthSessionService with store's dispatch
AuthSessionService.setDispatch(store.dispatch)

// Initialize NotificationSubscriptionManager with store's dispatch
NotificationSubscriptionManager.setDispatch(store.dispatch)

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
