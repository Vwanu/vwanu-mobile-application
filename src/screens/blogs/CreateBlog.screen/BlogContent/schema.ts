import * as Yup from 'yup'

export const initialValues = {
  title: '',
  content: '',
}

export type BlogFormValues = typeof initialValues

export const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(20, 'Content must be at least 20 characters')
    .required('Content is required'),
})

export const InterestsSchema = Yup.object().shape({
  interests: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please select at least one interest')
    .max(5, 'You can select up to 5 interests')
    .required(),
})
