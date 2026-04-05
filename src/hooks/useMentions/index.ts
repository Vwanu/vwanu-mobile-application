import { useFetchProfilesQuery } from 'store/profiles'
import type { UseMentionSuggestionsResult } from './types'

const useMentionSuggestions = (
  keyword: string | undefined
): UseMentionSuggestionsResult => {
  const shouldSearch = keyword !== undefined && keyword.length > 0

  const { data, isFetching } = useFetchProfilesQuery(
    shouldSearch ? { search: keyword, $limit: 10 } : undefined,
    { skip: !shouldSearch }
  )

  return {
    suggestions: shouldSearch ? data?.data || [] : [],
    isLoading: isFetching,
  }
}

export default useMentionSuggestions
