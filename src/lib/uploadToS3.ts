export type UploadProgress = {
  loaded: number
  total: number
  percent: number
}

export type UploadToS3Options = {
  onProgress?: (progress: UploadProgress) => void
  signal?: AbortSignal
}

const uriToBlob = async (fileUri: string): Promise<Blob> => {
  const response = await fetch(fileUri)
  if (!response.ok) {
    throw new Error(
      `Failed to read local file (${response.status}): ${fileUri}`
    )
  }
  return response.blob()
}

export const uploadToS3 = async (
  uploadUrl: string,
  fileUri: string,
  mimeType: string,
  options: UploadToS3Options = {}
): Promise<void> => {
  const { onProgress, signal } = options

  if (signal?.aborted) {
    throw new DOMException('Upload aborted', 'AbortError')
  }

  const blob = await uriToBlob(fileUri)

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    const onAbort = () => {
      xhr.abort()
    }

    const cleanup = () => {
      if (signal) signal.removeEventListener('abort', onAbort)
    }

    xhr.open('PUT', uploadUrl, true)
    xhr.setRequestHeader('Content-Type', mimeType)

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return
        const percent =
          event.total > 0 ? Math.round((event.loaded / event.total) * 100) : 0
        onProgress({ loaded: event.loaded, total: event.total, percent })
      }
    }

    xhr.onload = () => {
      cleanup()
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
        return
      }
      reject(
        new Error(
          `S3 upload failed (${xhr.status}): ${
            xhr.responseText || xhr.statusText
          }`
        )
      )
    }

    xhr.onerror = () => {
      cleanup()
      reject(new Error('Network error during S3 upload'))
    }

    xhr.onabort = () => {
      cleanup()
      reject(new DOMException('Upload aborted', 'AbortError'))
    }

    if (signal) {
      signal.addEventListener('abort', onAbort)
    }

    xhr.send(blob)
  })
}
