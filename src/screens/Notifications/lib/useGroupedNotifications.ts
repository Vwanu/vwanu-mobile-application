import { useMemo } from 'react'
import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns'

import type { NotificationInterface } from '../../../../types'

export type Row =
  | { kind: 'separator'; key: string; label: string }
  | { kind: 'item'; key: string; notification: NotificationInterface }

// Bucket label for grouping notifications by recency.
// Today / Yesterday / "N days ago" (2-7) / Earlier (8+).
const bucketLabel = (date: Date, now: Date): string => {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  const days = differenceInCalendarDays(now, date)
  if (days <= 7) return `${days} days ago`
  return 'Earlier'
}

// Walk items in order, emit a separator row when the bucket label changes,
// skip the very first "Today" separator (most-recent group needs no header).
export const useGroupedNotifications = (
  items: NotificationInterface[] | undefined
): Row[] =>
  useMemo(() => {
    const list = items ?? []
    const now = new Date()
    const out: Row[] = []
    let lastLabel: string | null = null
    for (const item of list) {
      const label = bucketLabel(new Date(item.createdAt), now)
      if (label !== lastLabel) {
        const isFirst = out.length === 0
        if (!(isFirst && label === 'Today')) {
          out.push({
            kind: 'separator',
            key: `sep:${label}:${item.id}`,
            label,
          })
        }
        lastLabel = label
      }
      out.push({
        kind: 'item',
        key: `item:${item.id}`,
        notification: item,
      })
    }
    return out
  }, [items])
