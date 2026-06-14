import React from 'react'

import tw from 'lib/tailwind'
import Text from 'components/Text'


const CardTitle: React.FC<{ title?: string }> = ({ title }) =>  (
    <Text style={tw`font-syne-bold text-ink dark:text-white text-base mt-3`}>
      {title}
    </Text>
  )

export default CardTitle
