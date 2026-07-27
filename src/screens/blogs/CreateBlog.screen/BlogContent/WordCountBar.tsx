import React from 'react'
import { View } from 'react-native'
import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import ReadingStats from '../../components/ReadingStats'
import { BlogFormValues } from './schema'

const WordCountBar = () => {
  const { values } = useFormikContext<BlogFormValues>()

  return (
    <View style={tw`px-4 py-1.5 border-t border-warm-border`}>
      <ReadingStats html={values.content || ''} style={tw`text-right`} />
    </View>
  )
}

export default WordCountBar
