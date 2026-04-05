import { useFetchProfilesQuery } from 'store/profiles'
import useDebounce from 'hooks/useDebounce'
import type { UseMentionSuggestionsResult } from './types'

const useMentionSuggestions = (
  keyword: string | undefined
): UseMentionSuggestionsResult => {
  const debouncedKeyword = useDebounce(keyword, 300)
  const shouldSearch =
    debouncedKeyword !== undefined && debouncedKeyword.length > 0

  const { data, isFetching } = useFetchProfilesQuery(
    shouldSearch ? { search: debouncedKeyword, $limit: 10 } : undefined,
    { skip: !shouldSearch }
  )

  return {
    suggestions: shouldSearch ? data?.data || [] : [],
    isLoading: isFetching,
  }
}

export default useMentionSuggestions
