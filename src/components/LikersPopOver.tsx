/*
========================================================
   Sub-Component: LikerPopover
   - Renders a popover listing users who liked the post.
======================================================== */

import React from 'react'
import { TouchableOpacity, View, Dimensions, FlatList } from 'react-native'
import { Popover } from '@ui-kitten/components'

import Text from './Text'
import tw from '../lib/tailwind'
import Separator from './Separator'
import ProfAvatar from './ProfAvatar'
import { ActivityIndicator } from 'react-native-paper'
import { formatDistanceToNow } from 'date-fns'

interface LikerPopoverProps {
  id: string
  visible: boolean
  onDismiss: () => void
  fetchLikers: ({ skip }: { skip?: boolean }) => {
    data: Array<{ User: User; createdAt: Date }>
    isFetching: boolean
    refetch: () => void
  }
}

const { width } = Dimensions.get('screen')
const LikerPopover: React.FC<LikerPopoverProps> = ({
  visible,
  onDismiss,
  fetchLikers,
  ...props
}) => {
  const { data, isFetching, refetch } = fetchLikers({ skip: !visible })

  console.log('💔💔LikerPopover data:', data, 'isFetching:', isFetching)
  return (
    <Popover
      visible={visible}
      anchor={() => {
        return (
          <TouchableOpacity onPress={onDismiss}>
            <Text style={tw`text-primary font-thin`}>others</Text>
          </TouchableOpacity>
        )
      }}
      onBackdropPress={onDismiss}
      backdropStyle={tw`bg-black bg-opacity-50`}
    >
      <View style={[tw` p-2`, { width: width / 2 }]}>
        {isFetching ? (
          <ActivityIndicator animating={true} />
        ) : (
          <FlatList
            refreshing={isFetching}
            onRefresh={refetch}
            data={data || []}
            renderItem={({ item }) => (
              <>
                <ProfAvatar user={item.User as User} size={25} />
                <Text category="c1" appearance="hint">
                  {formatDistanceToNow(new Date(item.createdAt as Date), {
                    addSuffix: true,
                  })}
                </Text>
              </>
            )}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={Separator}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Popover>
  )
}

export default LikerPopover
