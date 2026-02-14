import React from 'react'
import { Formik, FormikValues, FormikHelpers, FormikProps } from 'formik'
import { View, StyleProp, ViewStyle } from 'react-native'
import { AnyObjectSchema, InferType } from 'yup'
import { Layout } from '@ui-kitten/components'

interface FormProps<S extends AnyObjectSchema> {
  validationSchema: S
  initialValues: InferType<S>
  onSubmit: (
    values: InferType<S>,
    helpers: FormikHelpers<InferType<S>>
  ) => Promise<void> | void
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onValidationError?: (errors: any) => void
  enableDebug?: boolean
  innerRef?: React.Ref<FormikProps<InferType<S>>>
}

// Use a generic function component instead of React.FC so we can pass <T extends FormikValues>
function Form<S extends AnyObjectSchema>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  style,
  onValidationError,
  enableDebug = false,
  innerRef,
}: FormProps<S>) {
  const handleSubmit = async (
    values: InferType<S>,
    helpers: FormikHelpers<InferType<S>>
  ) => {
    try {
      // Validate before submitting
      await validationSchema.validate(values, { abortEarly: false })

      if (enableDebug) {
        console.log('✅ Validation passed')
        console.log('📤 Submitting values:', JSON.stringify(values, null, 2))
      }

      await onSubmit(values, helpers)
    } catch (error: any) {
      if (enableDebug) {
        console.log('❌ Validation failed')
        console.log('Validation errors:', error)
      }

      if (error.name === 'ValidationError') {
        // Yup validation error
        const validationErrors: any = {}
        error.inner?.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path] = err.message
          }
        })

        if (enableDebug) {
          console.log(
            '📋 Formatted errors:',
            JSON.stringify(validationErrors, null, 2)
          )
        }

        helpers.setErrors(validationErrors)

        if (onValidationError) {
          onValidationError(validationErrors)
        }
      }
    }
  }

  return (
    <Formik<InferType<S>>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      innerRef={innerRef}
    >
      {({ errors, touched, values, isValid }) => {
        if (enableDebug) {
          console.log('🔍 Form State:', {
            values,
            errors,
            touched,
            isValid,
          })
        }
        return <Layout style={style}>{children}</Layout>
      }}
    </Formik>
  )
}

export default Form
