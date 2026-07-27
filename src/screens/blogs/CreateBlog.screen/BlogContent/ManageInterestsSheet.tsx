import React, { useRef } from 'react'
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { Form } from 'components/form'
import InterestSelector from 'components/form/InterestSelector'
import { colors } from 'components/ui/tokens'
import { InterestsSchema } from './schema'

interface Props {
  visible: boolean
  onClose: () => void
  interestIds?: string[]
  onChange: (ids: string[]) => void
}

const ManageInterestsSheet = ({
  visible,
  onClose,
  interestIds,
  onChange,
}: Props) => {
  const formRef = useRef<FormikProps<{ interests: string[] }>>(null)

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={tw`flex-1 bg-warm-bg`}>
        <View style={tw`flex-row items-center justify-between px-4 py-3`}>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Text style={[tw`font-poppins-medium`, { color: colors.soft }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[tw`font-syne-bold text-base`, { color: colors.ink }]}>
            Interests
          </Text>
          <View style={tw`w-12`} />
        </View>

        {visible && (
          <Form
            validationSchema={InterestsSchema}
            initialValues={{ interests: interestIds ?? [] }}
            onSubmit={(v: { interests: string[] }) => onChange(v.interests)}
            innerRef={formRef}
            style={tw`flex-1`}
          >
            <ScrollView
              style={tw`flex-1`}
              contentContainerStyle={tw`px-4 pb-6`}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <InterestSelector
                name="interests"
                Label="Interests"
                showCount
                required
                maxSelected={5}
              />
            </ScrollView>
          </Form>
        )}

        <View style={tw`px-4 pt-2 pb-4 border-t border-warm-border`}>
          <TouchableOpacity
            onPress={() => formRef.current?.submitForm()}
            style={[
              tw`py-3 rounded-full items-center`,
              { backgroundColor: colors.primaryDeep },
            ]}
          >
            <Text style={tw`text-white font-poppins-bold`}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default ManageInterestsSheet
