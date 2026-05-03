import { useCallback, useRef, useState } from 'react'

import { uploadToS3 } from 'lib/uploadToS3'
import {
  useGetPresignedUploadUrlsMutation,
  UploadType,
  PresignBatchResponse,
  PresignFileResponse,
} from 'store/uploads-api-slice'
import { PostMediaKey, PostMediaType } from 'store/post'

export type MediaItemStatus = 'uploading' | 'done' | 'error'

export interface MediaItemInput {
  uri: string
  filename: string
  mimeType: string
}

export interface MediaItem extends MediaItemInput {
  id: string
  status: MediaItemStatus
  progress: number
  key?: string
  publicUrl?: string
  error?: string
}

export interface UseMediaUploadsOptions {
  uploadType?: UploadType
}

export interface UseMediaUploadsResult {
  items: MediaItem[]
  isAnyUploading: boolean
  hasError: boolean
  doneCount: number
  addFiles: (files: MediaItemInput[]) => Promise<void>
  removeItem: (id: string) => void
  retryItem: (id: string) => Promise<void>
  clearAll: () => void
  getCompletedKeys: () => PostMediaKey[]
}

const mimeToMediaType = (mime: string): PostMediaType => {
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  return 'image'
}

const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const useMediaUploads = (
  options: UseMediaUploadsOptions = {}
): UseMediaUploadsResult => {
  const { uploadType = 'post' } = options
  const [items, setItems] = useState<MediaItem[]>([])
  const abortControllers = useRef<Map<string, AbortController>>(new Map())
  const [getPresignedUploadUrls] = useGetPresignedUploadUrlsMutation()

  const updateItem = useCallback((id: string, patch: Partial<MediaItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }, [])

  const uploadOne = useCallback(
    async (item: MediaItem, presigned: PresignFileResponse) => {
      const controller = new AbortController()
      abortControllers.current.set(item.id, controller)

      try {
        await uploadToS3(presigned.uploadUrl, item.uri, item.mimeType, {
          signal: controller.signal,
          onProgress: ({ percent }) => {
            updateItem(item.id, { progress: percent })
          },
        })
        updateItem(item.id, {
          status: 'done',
          progress: 100,
          key: presigned.key,
          publicUrl: presigned.publicUrl,
          error: undefined,
        })
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return
        }
        updateItem(item.id, {
          status: 'error',
          error: err?.message ?? 'Upload failed',
        })
      } finally {
        abortControllers.current.delete(item.id)
      }
    },
    [updateItem]
  )

  const addFiles = useCallback(
    async (files: MediaItemInput[]) => {
      if (files.length === 0) return

      const seeded: MediaItem[] = files.map((file) => ({
        ...file,
        id: newId(),
        status: 'uploading',
        progress: 0,
      }))
      setItems((prev) => [...prev, ...seeded])

      let presignResponse: PresignBatchResponse
      try {
        presignResponse = await getPresignedUploadUrls({
          files: seeded.map(({ filename, mimeType }) => ({
            filename,
            mimeType,
            uploadType,
          })),
        }).unwrap()
      } catch (err: any) {
        const message = err?.data?.error ?? err?.message ?? 'Presign failed'
        setItems((prev) =>
          prev.map((item) =>
            seeded.find((s) => s.id === item.id)
              ? { ...item, status: 'error', error: message }
              : item
          )
        )
        return
      }

      await Promise.all(
        seeded.map((item, index) =>
          uploadOne(item, presignResponse.files[index])
        )
      )
    },
    [getPresignedUploadUrls, uploadType, uploadOne]
  )

  const removeItem = useCallback((id: string) => {
    const controller = abortControllers.current.get(id)
    if (controller) controller.abort()
    abortControllers.current.delete(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const retryItem = useCallback(
    async (id: string) => {
      const target = items.find((item) => item.id === id)
      if (!target) return

      updateItem(id, { status: 'uploading', progress: 0, error: undefined })

      let presignResponse: PresignBatchResponse
      try {
        presignResponse = await getPresignedUploadUrls({
          files: [
            {
              filename: target.filename,
              mimeType: target.mimeType,
              uploadType,
            },
          ],
        }).unwrap()
      } catch (err: any) {
        const message = err?.data?.error ?? err?.message ?? 'Presign failed'
        updateItem(id, { status: 'error', error: message })
        return
      }

      await uploadOne(target, presignResponse.files[0])
    },
    [items, getPresignedUploadUrls, uploadType, uploadOne, updateItem]
  )

  const clearAll = useCallback(() => {
    abortControllers.current.forEach((controller) => controller.abort())
    abortControllers.current.clear()
    setItems([])
  }, [])

  const getCompletedKeys = useCallback((): PostMediaKey[] => {
    return items
      .filter((item) => item.status === 'done' && item.key)
      .map((item) => ({
        key: item.key!,
        type: mimeToMediaType(item.mimeType),
      }))
  }, [items])

  const isAnyUploading = items.some((item) => item.status === 'uploading')
  const hasError = items.some((item) => item.status === 'error')
  const doneCount = items.filter((item) => item.status === 'done').length

  return {
    items,
    isAnyUploading,
    hasError,
    doneCount,
    addFiles,
    removeItem,
    retryItem,
    clearAll,
    getCompletedKeys,
  }
}
