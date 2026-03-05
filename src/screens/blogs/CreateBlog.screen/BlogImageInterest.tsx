import * as Yup from 'yup'
import { View } from 'react-native'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import { Form } from 'components/form'
import ImageUploadSection from 'components/form/ImageUploadSection'
import InterestSelector from 'components/form/InterestSelector'

const ValidationSchema = Yup.object().shape({
  titlePicture: Yup.string().nullable(),
  interests: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please select at least one interest')
    .max(5, 'You can select up to 5 interests')
    .required('Interests are required'),
})

let initialValues = {
  titlePicture: '',
  interests: [],
}

interface BlogImage {
  formRef?: React.Ref<FormikProps<any>>
  onSubmit: (values: typeof initialValues) => void
  values?: typeof initialValues
}

const BlogImageInterest: React.FC<BlogImage> = ({
  formRef,
  onSubmit,
  values,
}) => {
  if (values) {
    initialValues = values
  }
  const handleSubmit = (values: any) => {
    onSubmit(values)
  }
  return (
    <Form
      validationSchema={ValidationSchema}
      initialValues={initialValues}
      style={tw`flex-1`}
      onSubmit={handleSubmit}
      innerRef={formRef}
    >
      <>
        <ImageUploadSection
          name="titlePicture"
          label="Cover Image"
          helperText="Tap to upload a cover image for your blog"
        />

        <View style={tw`px-4 py-6`}>
          <InterestSelector
            name="interests"
            Label="Interests"
            showCount={true}
            maxSelected={5}
            required={true}
          />
        </View>
      </>
    </Form>
  )
}

export default BlogImageInterest
