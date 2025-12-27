import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import { CommunityStackParams, CommunityInterface } from '../../../types'
import ImageUploadSection from '../../components/form/ImageUploadSection'
import InterestSelector from '../../components/form/InterestSelector'
import {
  useCreateCommunityMutation,
  useFetchCommunityQuery,
  useUpdateCommunityMutation,
} from '../../store/communities-api-slice'
import { Field, Form } from 'components/form'
import * as Yup from 'yup'
import FormHeader from 'components/form/FormHeader'
import FormContent from 'components/form/FormContent'
import { InferType } from 'yup'
import { isEqual } from 'lodash'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

type NavigationProp = StackNavigationProp<
  CommunityStackParams,
  'CreateCommunity'
>

type CreateCommunityRouteProp = RouteProp<
  CommunityStackParams,
  'CreateCommunity'
>

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  profilePicture: Yup.string().nullable(),
  interests: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please select at least one interest')
    .max(5, 'You can select up to 5 interests')
    .required('Interests are required'),
  // privacyType: Yup.string().required('Privacy Type is required'),
  // requireApproval: Yup.boolean().required('Require Approval is required'),
})

const CreateCommunity = () => {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<CreateCommunityRouteProp>()
  const [unifiedError, setUnifiedError] = React.useState<
    FetchBaseQueryError | SerializedError | null
  >(null)

  // Extract communityId from route params and determine mode
  const { communityId } = route.params || {}
  const isEditMode = !!communityId

  // Fetch existing community data if in edit mode
  const {
    data: existingCommunity,
    isLoading: isFetchingCommunity,
    error: fetchError,
  } = useFetchCommunityQuery(communityId || '', {
    skip: !isEditMode,
  })

  // Mutation hooks
  const [createCommunity, { isLoading: isCreating, error: createError }] =
    useCreateCommunityMutation()
  const [updateCommunity, { isLoading: isUpdating, error: updateError }] =
    useUpdateCommunityMutation()

  // Unified loading and error states
  const isLoading = isEditMode ? isFetchingCommunity || isUpdating : isCreating
  const error = fetchError || createError || updateError

  // Transform API data to form values based on mode
  const initialValues = useMemo(() => {
    if (isEditMode && existingCommunity) {
      return {
        name: existingCommunity.name,
        description: existingCommunity.description,
        profilePicture: existingCommunity.profilePicture || '',
        interests:
          existingCommunity.interests?.map((interest) =>
            interest.id.toString()
          ) || [],
      }
    }
    return {
      name: '',
      description: '',
      profilePicture: '',
      interests: [],
    }
  }, [isEditMode, existingCommunity])

  const getEditChangedFields = (
    formData: InferType<typeof ValidationSchema>,
    existingCommunity: CommunityInterface
  ) => {
    const changes: any = {}
    // Compare name
    if (formData.name !== existingCommunity.name) {
      changes.name = formData.name
    }
    // Compare description
    if (formData.description !== existingCommunity.description) {
      changes.description = formData.description
    }
    // Compare profilePicture (form) with profilePicture (API)
    if (formData.profilePicture !== existingCommunity.profilePicture) {
      changes.profilePicture = formData.profilePicture
    }
    // Compare interests - extract IDs from existing community first
    const existingInterestIds =
      existingCommunity.interests?.map((i) => i.id.toString()) || []
    const formInterestIds = formData.interests || []

    // Use lodash isEqual for deep array comparison (order-independent)
    if (
      !isEqual([...existingInterestIds].sort(), [...formInterestIds].sort())
    ) {
      changes.interests = formData.interests
    }

    return changes
  }
  const handleSubmit = async (formData: InferType<typeof ValidationSchema>) => {
    if (isEditMode && communityId && existingCommunity) {
      await updateCommunity({
        id: communityId,
        ...getEditChangedFields(formData, existingCommunity),
      })
        .then(() => navigation.replace('CommunityDetail', { communityId }))
        .catch((err) => {
          setUnifiedError(err)
        })
    } else {
      // @ts-ignore
      await createCommunity(formData)
        .then((result) => {
          navigation.replace('CommunityDetail', {
            // @ts-ignore
            communityId: result.data?.id,
          })
        })
        .catch((err) => {
          setUnifiedError(err)
        })
    }
  }
  return (
    <Screen loading={isLoading} error={unifiedError as any}>
      <View style={tw`flex-1 bg-gray-50 px-3`}>
        <Form
          validationSchema={ValidationSchema}
          initialValues={initialValues}
          style={tw`flex-1`}
          onSubmit={handleSubmit}
        >
          <FormHeader
            onClose={() => navigation.goBack()}
            isLoading={isLoading}
            submitTitle={isEditMode ? 'Update' : 'Create'}
            submittingText={isEditMode ? 'Updating...' : 'Creating...'}
          />

          <FormContent>
            <ImageUploadSection name="profilePicture" />

            <Text category="h6" style={tw`font-semibold text-lg mb-4`}>
              Basic Information
            </Text>
            <Field
              name="name"
              placeholder="Enter community name"
              style={tw`bg-gray-50`}
              required
              label="Community Name"
            />

            <Field
              name="description"
              placeholder="Describe your community..."
              style={tw`bg-gray-50 text-base min-h-20`}
              required
              multiline
              numberOfLines={4}
              label="Description"
            />

            <InterestSelector
              name="interests"
              Label="Interests"
              showCount={true}
              maxSelected={5}
              required={true}
            />

            {/* <PrivacySettings
            privacyType={(values['privacyType'] || 'public') as CommunityPrivacyType}
            requireApproval={values['requireApproval'] || false}
            onPrivacyTypeChange={(privacyType) => setFieldValue('privacyType', privacyType)}
            onApprovalChange={(requireApproval) => setFieldValue('requireApproval', requireApproval)}
          /> */}

            {/* Bottom spacing */}
            <View style={tw`h-20`} />
          </FormContent>
        </Form>
      </View>
    </Screen>
  )
}

export default CreateCommunity
