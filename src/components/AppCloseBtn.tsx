import React from 'react'

import { Ionicons } from '@expo/vector-icons'
import Button from './Button'
import tw from '../lib/tailwind'

interface AppCloseBtnProps {
  onPress: () => void
}
const AppCloseBtn = ({ onPress }: AppCloseBtnProps) => {
  return (
    <Button
      onPress={onPress}
      style={tw`p-2 rounded-full border border-gray-300`}
      textStyle={tw`text-black`}
      appearance="ghost"
      size="small"
      disabled={false}
      accessoryRight={() => <Ionicons name="close" size={24} color="#000" />}
    />
  )
}

export default AppCloseBtn
