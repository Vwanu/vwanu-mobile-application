import React from 'react'
import { useFormikContext } from 'formik'

import ModalSubmitPill from 'components/ui/ModalSubmitPill'

interface Props {
  enabled: boolean
  loading?: boolean
}

const FormSubmitPill: React.FC<Props> = ({ enabled, loading }) => {
  const { handleSubmit } = useFormikContext()
  return (
    <ModalSubmitPill
      enabled={enabled}
      loading={loading}
      onPress={() => handleSubmit()}
    />
  )
}

export default FormSubmitPill
