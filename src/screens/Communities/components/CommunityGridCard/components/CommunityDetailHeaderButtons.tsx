import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Button from 'components/Button'

const CommunityDetailHeaderButtons: React.FC = () => {
  const navigation = useNavigation()
  return (
    <View style={tw`pt-10`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Button
          accessoryRight={() => (
            <Ionicons name="arrow-back" size={24} color="white" />
          )}
          onPress={() => navigation.goBack()}
          appearance="ghost"
        />
        <Button
          accessoryRight={() => (
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          )}
          onPress={() => navigation.goBack()}
          appearance="ghost"
        />
      </View>
    </View>
  )
}

export default CommunityDetailHeaderButtons
