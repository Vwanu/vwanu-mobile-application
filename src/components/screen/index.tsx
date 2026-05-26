import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native'
import { Layout } from '@ui-kitten/components'
import tw from '../../lib/tailwind'
import Toast from '../Toast'
import DefaultPageLoading from './components/PageLoading'
import { useMessage } from 'contexts/MessageContext'

interface ErrorProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  retryText?: string
}

export interface ScreenProps {
  children: React.ReactNode
  loadingScreen?: React.ReactNode
  loading?: boolean
  error?: ErrorProps | string | null
  showToast?: boolean
  safeArea?: boolean
}

const Screen: React.FC<ScreenProps> = ({
  loading = false,
  children,
  error,
  loadingScreen,
  showToast = true,
  safeArea = true,
}) => {
  const { messages, removeMessage } = useMessage()
  const [localError, setLocalError] = useState<ErrorProps | string | null>(
    error || null
  )

  useEffect(() => {
    setLocalError(error || null)
  }, [error])

  const handleErrorDismiss = () => {
    if (typeof localError !== 'string' && localError?.onDismiss) {
      localError.onDismiss()
    }
    setLocalError(null)
  }

  return (
    <Layout style={tw`flex-1`}>
      {loading ? (
        <>{loadingScreen ? loadingScreen : <DefaultPageLoading />}</>
      ) : (
        <>
          {safeArea ? (
            <SafeAreaView style={tw`flex-1 bg-warm-bg`}>
              {messages?.map((msg, index) => (
                <Toast
                  key={index}
                  type={msg.type || 'info'}
                  message={msg.text}
                  position="top"
                  autoDismiss={true}
                  onDismiss={() => removeMessage(msg.id)}
                />
              ))}
              {children}
            </SafeAreaView>
          ) : (
            <>
              {messages?.map((msg, index) => (
                <Toast
                  key={index}
                  type={msg.type || 'info'}
                  message={msg.text}
                  position="top"
                  autoDismiss={true}
                  onDismiss={() => removeMessage(msg.id)}
                />
              ))}
              {children}
            </>
          )}
        </>
      )}

      {showToast && localError && (
        <Toast
          type="error"
          message={
            typeof localError === 'string' ? localError : localError.message
          }
          onRetry={
            typeof localError !== 'string' ? localError.onRetry : undefined
          }
          onDismiss={handleErrorDismiss}
          position="bottom"
          autoDismiss={false}
        />
      )}
    </Layout>
  )
}

Screen.propTypes = {
  children: PropTypes.node.isRequired,
  loadingScreen: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func as PropTypes.Requireable<() => void>,
    onDismiss: PropTypes.func as PropTypes.Requireable<() => void>,
    retryText: PropTypes.string,
  }) as PropTypes.Validator<ErrorProps | null | undefined>,
  showToast: PropTypes.bool,
}

export default Screen
