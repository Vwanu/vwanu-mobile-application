import React from 'react'
import { View } from 'react-native'
import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import { Field } from 'components/form'
import { BlogFormValues } from './schema'

const TitleField = ({ light }: { light?: boolean }) => {
  const { values } = useFormikContext<BlogFormValues>()
  const hasTitle = !!values.title?.trim()

  return (
    <View
      style={!light && !hasTitle ? tw`border-b border-b-gray-300` : undefined}
    >
      <Field
        name="title"
        placeholder="Title"
        style={tw`border-0 bg-transparent`}
        textStyle={tw`text-3xl font-syne-bold ${light ? 'text-white' : ''}`}
        required
        autoFocus
        multiline
      />
    </View>
  )
}

export default TitleField
