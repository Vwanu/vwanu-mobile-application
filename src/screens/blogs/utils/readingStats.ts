export const WORDS_PER_MINUTE = 200

export const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()

export const countWords = (html: string) => {
  const text = stripHtml(html)
  return text ? text.split(/\s+/).length : 0
}

export const readingMinutes = (words: number) =>
  Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))

export interface ReadingStats {
  words: number
  minutes: number
}

export const getReadingStats = (html: string): ReadingStats => {
  const words = countWords(html)
  return { words, minutes: readingMinutes(words) }
}
