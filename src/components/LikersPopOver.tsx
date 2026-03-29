/*
========================================================
   Sub-Component: LikerPopover
   - Renders a popover listing users who liked the post.
======================================================== */

import React, { useCallback } from 'react'
import { View, Dimensions, FlatList } from 'react-native'
import { Popover } from '@ui-kitten/components'

import tw from '../lib/tailwind'
import Separator from './Separator'
import ProfAvatar from './ProfAvatar'
import { ActivityIndicator } from 'react-native-paper'
import { formatDistanceToNow } from 'date-fns'

interface LikerPopoverProps {
  visible: boolean
  onDismiss: () => void
  likers: Array<{ User: User; createdAt: Date }>
  isFetching: boolean
  onRefetch: () => void
  anchorContent: React.ReactElement
}

const { width } = Dimensions.get('screen')
const LikerPopover: React.FC<LikerPopoverProps> = ({
  visible,
  onDismiss,
  likers,
  isFetching,
  onRefetch,
  anchorContent,
}) => {
  const renderAnchor = useCallback(() => anchorContent, [anchorContent])

  return (
    <Popover
      visible={visible}
      anchor={renderAnchor}
      placement="bottom"
      onBackdropPress={onDismiss}
      backdropStyle={tw`bg-black bg-opacity-50`}
    >
      <View style={[tw`p-2`, { width: width / 2, maxHeight: 250 }]}>
        {isFetching ? (
          <ActivityIndicator animating={true} />
        ) : (
          <FlatList
            refreshing={isFetching}
            onRefresh={onRefetch}
            data={likers || []}
            renderItem={({ item }) => (
              <ProfAvatar
                user={item.User as User}
                size={25}
                subtitle={formatDistanceToNow(
                  new Date(item.createdAt as Date),
                  {
                    addSuffix: true,
                  }
                )}
              />
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
