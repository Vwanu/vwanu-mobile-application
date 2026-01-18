import React from 'react'
import { View } from 'react-native'
import { Avatar } from 'react-native-paper'

import tw from '../../../../lib/tailwind'
import Text from '../../../../components/Text'
import Kore from '../../../../assets/svg/Kore'
import { CommentInterface } from '../../../../../types'
import { abbreviateNumber } from '../../../../lib/numberFormat'

const Comment: React.FC<CommentInterface> = (props) => {
  return (
    <View style={tw`flex flex-1 flex-row justify-between items-center `}>
      <View style={tw`flex justify-center items-center `}>
        <Avatar.Image
          source={{
            uri: props.user?.profilePicture,
          }}
          size={50}
        />
        <View style={tw`flex flex-row mr-3 items-center justify-center`}>
          <Kore />
          <Text
            category="s1"
            style={tw`text-sm text-gray-500 font-thin text-wrap`}
          >
            {abbreviateNumber(props.likes)}
          </Text>
        </View>
      </View>
      <View style={tw`flex-1`}>
        <Text category="p2" style={tw`text-gray-500 mb-2 text-wrap`}>
          {props.postText}
        </Text>
      </View>
      <Text
        appearance="hint"
        style={tw`text-black text-center text-wrap font-thin ml-1 w-10`}
      >
        {/* {formatDistanceToNowStrict(new Date(props.createdAt), {
          addSuffix: false,
        })} */}
      </Text>
    </View>
  )
}

export default Comment
