import React from 'react'
import { View, ImageBackground } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import tw from 'lib/tailwind'
import { cdnImageUrl } from 'lib/cdnImageUrl'

interface Props {
  profilePicture?: string | null
  loading?: boolean
  children: React.ReactNode
}

const CommunityCardMedia: React.FC<Props> = ({
  profilePicture,
  loading,
  children,
}) => (
  <ImageBackground
    source={{
      uri: cdnImageUrl(profilePicture, { width: 600, height: 600 }),
    }}
    style={tw`w-full h-full`}
    resizeMode="cover"
  >
    {loading && <ActivityIndicator animating={loading} />}
    <View style={tw`bg-black bg-opacity-50 h-full flex justify-between p-3`}>
      {children}
    </View>
  </ImageBackground>
)

export default CommunityCardMedia
