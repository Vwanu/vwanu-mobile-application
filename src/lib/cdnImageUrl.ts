/**
 * Builds CloudFront URLs that hit the AWS Dynamic Image Transformation
 * Lambda@Edge handler (deployed via VWA-131). The handler accepts requests
 * shaped as `<cdn-host>/<base64(JSON)>` where the JSON describes an edit
 * pipeline applied to the source S3 object.
 *
 * Two ways to call:
 *   cdnImageUrl(key, 'medium')                       // preset
 *   cdnImageUrl(key, { width: 400, height: 200 })    // explicit
 *   cdnImageUrl(key, { preset: 'medium', width: 800 }) // preset + override
 *
 * Backwards compat: if a full S3 URL is passed instead of a key, the bucket
 * prefix is stripped and the key extracted. External URLs (Cloudinary,
 * Unsplash placeholders) are returned unchanged — only S3 URLs go through
 * the CDN.
 */

const CDN_URL = process.env.EXPO_PUBLIC_CDN_URL
const BUCKET = process.env.EXPO_PUBLIC_S3_BUCKET

export type ImagePreset = 'thumb' | 'small' | 'medium' | 'large' | 'original'

export type ImageFit = 'cover' | 'contain' | 'inside' | 'outside' | 'fill'

export interface ImageOptions {
  preset?: ImagePreset
  width?: number
  height?: number
  fit?: ImageFit
}

const PRESETS: Record<ImagePreset, { width?: number; height?: number }> = {
  thumb: { width: 100, height: 100 },
  small: { width: 200, height: 200 },
  medium: { width: 600 },
  large: { width: 1200 },
  original: {},
}

const isS3Url = (s: string): boolean => /\.amazonaws\.com\//.test(s)

const extractKey = (url: string): string | null => {
  const m = url.match(/\.amazonaws\.com\/(.+?)(\?.*)?$/)
  return m ? m[1] : null
}

const base64Encode = (str: string): string => {
  if (typeof btoa === 'function') return btoa(str)
  // RN < 0.74 / Node test env fallback
  // @ts-ignore — Buffer may not exist on all RN runtimes
  return Buffer.from(str, 'utf-8').toString('base64')
}

const resolveSize = (
  options: ImageOptions
): { width?: number; height?: number; fit?: ImageFit } => {
  const fromPreset = options.preset ? PRESETS[options.preset] : {}
  const width = options.width ?? fromPreset.width
  const height = options.height ?? fromPreset.height
  if (width === undefined && height === undefined) return {}
  // When BOTH are set, fit decides crop vs letterbox. Default to cover
  // (fill the box, may crop) — matches what avatars/feed tiles want.
  const fit =
    options.fit ??
    (width !== undefined && height !== undefined ? 'cover' : undefined)
  return { width, height, fit }
}

const normaliseInput = (
  options: ImageOptions | ImagePreset | undefined
): ImageOptions => {
  if (typeof options === 'string') return { preset: options }
  return options ?? { preset: 'medium' }
}

export const cdnImageUrl = (
  keyOrUrl: string | null | undefined,
  options: ImageOptions | ImagePreset = 'medium'
): string | undefined => {
  if (!keyOrUrl) return undefined

  // External URL (Cloudinary, Unsplash, etc.) — return as-is, don't proxy.
  if (/^https?:\/\//.test(keyOrUrl) && !isS3Url(keyOrUrl)) return keyOrUrl

  // S3 URL — extract the key for further processing.
  let key = keyOrUrl
  if (isS3Url(keyOrUrl)) {
    const extracted = extractKey(keyOrUrl)
    if (!extracted) return keyOrUrl
    key = extracted
  }

  // CDN not configured — fall back to direct S3 URL (local dev safety net).
  if (!CDN_URL || !BUCKET) {
    if (keyOrUrl.startsWith('http')) return keyOrUrl
    return BUCKET ? `https://${BUCKET}.s3.amazonaws.com/${key}` : undefined
  }

  const opts = normaliseInput(options)
  const size = resolveSize(opts)

  const request: {
    bucket: string
    key: string
    edits?: Record<string, unknown>
  } = {
    bucket: BUCKET,
    key,
  }
  if (size.width !== undefined || size.height !== undefined) {
    const resize: Record<string, unknown> = {}
    if (size.width !== undefined) resize.width = size.width
    if (size.height !== undefined) resize.height = size.height
    if (size.fit !== undefined) resize.fit = size.fit
    request.edits = { resize }
  }

  const encoded = base64Encode(JSON.stringify(request))
  return `${CDN_URL.replace(/\/$/, '')}/${encoded}`
}
