import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import SelectMultiple from './SelectMultiple'
import { colors } from 'components/ui/tokens'
import { useFetchInterestsQuery } from '../../store/interests'

interface Props {
  required: boolean
  Label: string
  showCount: boolean
  maxSelected: number
  name: string
}

const InterestPill = ({
  label,
  value,
  isSelected,
}: {
  label: string
  value: string
  isSelected: boolean
}) => {
  return (
    <View
      key={value}
      style={[
        tw`flex-row items-center justify-center px-3.5 py-2 rounded-full border mr-2 mb-2`,
        {
          backgroundColor: isSelected ? colors.primarySoft : 'transparent',
          borderColor: isSelected ? colors.primaryDeep : colors.warmBorder,
        },
      ]}
    >
      {isSelected && (
        <Ionicons
          name="checkmark"
          size={14}
          color={colors.primaryDeep}
          style={tw`mr-1`}
        />
      )}
      <Text
        style={[
          tw`font-poppins-medium text-sm`,
          { color: isSelected ? colors.primaryDeep : colors.soft },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}
const InterestSelector: React.FC<Props> = ({
  required,
  Label,
  showCount,
  maxSelected,
  name,
}) => {
  const [selectedInterestsCount, setSelectedInterestsCount] = useState(0)
  const { data: interests, isFetching: interestFetching } =
    useFetchInterestsQuery()

  if (interestFetching) {
    return (
      <View style={tw`flex-row justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }
  return (
    <View style={tw``}>
      <View style={tw`flex-row justify-between items-center`}>
        {Label && (
          <Text category="h6" style={tw`font-semibold text-lg`}>
            {Label}
          </Text>
        )}
        {showCount && (
          <Text
            style={tw` text-sm ${
              selectedInterestsCount > 0 ? 'text-black' : 'text-gray-500'
            }`}
          >
            {selectedInterestsCount}/5 selected
            {selectedInterestsCount > 0 && (
              <Ionicons name="checkmark" size={14} color={colors.primaryDeep} />
            )}
          </Text>
        )}
      </View>
      <SelectMultiple
        name={name}
        items={
          interests?.map(({ name, id }) => ({
            label: name,
            value: id.toString(),
          })) || []
        }
        IdleComponent={({ label, value }) => (
          <InterestPill label={label} value={value} isSelected={false} />
        )}
        SelectedComponent={({ label, value }) => (
          <InterestPill label={label} value={value} isSelected={true} />
        )}
        wrapperStyle={tw`flex-row flex-wrap`}
        maxSelected={maxSelected}
        required
        selectedItemsCount={setSelectedInterestsCount}
      />
    </View>
  )
}

export default InterestSelector
