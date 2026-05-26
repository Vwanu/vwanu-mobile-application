import React, { useCallback, useMemo } from 'react'
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import EmptyList from 'components/EmptyList'
import { colors } from 'components/ui/tokens'

import PersonCard from './PersonCard'

type Row<T> =
  | { type: 'header'; key: string; label: string }
  | { type: 'card'; key: string; item: T }

interface Props<T = Profile> {
  items: T[]
  getProfile: (item: T) => Profile
  sections?: { key: string; label: string; data: T[] }[]
  loading?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  emptyTitle?: string
  emptySubtitle?: string
  renderAccessory?: (item: T) => React.ReactNode
}

function PersonList<T>({
  items,
  getProfile,
  sections,
  loading = false,
  refreshing = false,
  onRefresh,
  emptyTitle = 'No people found',
  emptySubtitle = 'Try refreshing the list',
  renderAccessory,
}: Props<T>) {
  const rows: Row<T>[] = useMemo(() => {
    if (sections && sections.length > 0) {
      const flat: Row<T>[] = []
      sections.forEach((section) => {
        flat.push({
          type: 'header',
          key: `header-${section.key}`,
          label: section.label,
        })
        section.data.forEach((item) => {
          flat.push({
            type: 'card',
            key: `card-${section.key}-${getProfile(item).id}`,
            item,
          })
        })
      })
      return flat
    }
    return items.map((item) => ({
      type: 'card' as const,
      key: `card-${getProfile(item).id}`,
      item,
    }))
  }, [items, sections, getProfile])

  const renderItem = useCallback(
    ({ item: row }: { item: Row<T> }) => {
      if (row.type === 'header') {
        return (
          <Text
            style={tw`px-1 mt-4 mb-2 text-xs font-poppins-bold text-mute tracking-widest uppercase`}
          >
            {row.label}
          </Text>
        )
      }
      return (
        <PersonCard
          user={getProfile(row.item)}
          accessoryRight={renderAccessory?.(row.item)}
        />
      )
    },
    [renderAccessory, getProfile]
  )

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={tw`items-center justify-center py-20`}>
          <ActivityIndicator size="small" color={colors.primaryDeep} />
        </View>
      )
    }
    return (
      <EmptyList
        icon="people-outline"
        title={emptyTitle}
        subtitle={emptySubtitle}
      />
    )
  }

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => row.key}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={tw`px-4 pb-24`}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryDeep}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default PersonList
