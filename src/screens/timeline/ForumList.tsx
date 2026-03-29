import React, { useCallback } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native'
import { ImageBackground } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { useFetchInterestsQuery, Interest } from 'store/interests'
import { FeedStackParams } from '../../../types'

const ForumCard: React.FC<{ forum: Interest; onPress: () => void }> = ({
  forum,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[tw`mb-4 mx-3 rounded-xl overflow-hidden`, shadowStyle]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <ImageBackground
        source={forum.coverPicture ? { uri: forum.coverPicture } : undefined}
        style={tw`h-[180px] w-full`}
      >
        <View style={tw`flex-1 justify-end bg-black/40 p-4`}>
          <Text style={tw`text-white text-lg font-bold`}>{forum.name}</Text>
          {forum.description ? (
            <Text style={tw`text-white/80 text-sm mt-1`} numberOfLines={2}>
              {forum.description}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const ForumList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<FeedStackParams>>()
  const {
    data: interests,
    isLoading,
    isFetching,
    refetch,
  } = useFetchInterestsQuery()

  const handleForumPress = useCallback(
    (forum: Interest) => {
      navigation.navigate('ForumDetail', { forum })
    },
    [navigation]
  )

  const renderItem = useCallback(
    ({ item }: { item: Interest }) => (
      <ForumCard forum={item} onPress={() => handleForumPress(item)} />
    ),
    [handleForumPress]
  )

  const renderEmpty = useCallback(() => {
    if (isLoading) return null
    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
        <Text
          style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4`}
        >
          No forums yet
        </Text>
        <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mt-2`}>
          Check back later
        </Text>
      </View>
    )
  }, [isLoading])

  return (
    <FlatList
      data={interests}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={tw`pt-4 pb-34`}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetch}
          tintColor={tw.color('primary')}
        />
      }
    />
  )
}

const shadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
  }),
}

export default ForumList
