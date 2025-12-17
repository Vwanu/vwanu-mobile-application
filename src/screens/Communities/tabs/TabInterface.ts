import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

export interface TabInterFace {
  communityId: string
  onError: (error: FetchBaseQueryError | SerializedError) => void
}
