import { useFetchProfilesQuery } from 'store/profiles'
import useDebounce from 'hooks/useDebounce'
import type { UseMentionSuggestionsResult } from './types'

const useMentionSuggestions = (
  keyword: string | undefined
): UseMentionSuggestionsResult => {
  const debouncedKeyword = useDebounce(keyword, 300)
  const shouldSearch = debouncedKeyword !== undefined

  const { data, isFetching } = useFetchProfilesQuery(
    shouldSearch
      ? { search: debouncedKeyword || undefined, $limit: 10 }
      : undefined,
    { skip: !shouldSearch }
  )

  return {
    suggestions: shouldSearch ? data?.data || [] : [],
    isLoading: isFetching,
  }
}

export default useMentionSuggestions
