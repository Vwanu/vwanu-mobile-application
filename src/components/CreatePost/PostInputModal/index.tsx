import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { string, object, mixed, InferType, array, number } from 'yup'
import { useSelector } from 'react-redux'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  Modal,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native'
import { styles } from './style'

import tw from 'lib/tailwind'
import ProfAvatar from '../../ProfAvatar'
import {
  Field,
  Form,
  Submit,
  ImageFields,
  PrivacyNoticeField,
} from '../../form'
import Text from '../../Text'
import { useCreatePostMutation } from 'store/post'
import { Notice } from '../../../../types'
import { useFetchProfileQuery } from 'store/profiles'
import { RootState } from 'store'
import nameToPicture from 'lib/nameToPicture'
import { useFormikContext } from 'formik'
import routes from 'navigation/routes'
import { useTheme } from 'hooks/useTheme'

interface PostInputModalInterface {
  visible: boolean
  openBottomSheet: boolean
  onClose?: () => void
  communityId?: string
}

export interface PostInputModalHandle {
  focus: () => void
}
const POST_INPUT_MODAL_CLOSE_TIMEOUT = 250 // 250ms

const ValidationSchema = object().shape({
  postText: string().label('Content'),
  privacyType: mixed<Notice>().required().label('Privacy Type'),
  postImage: array().of(string()).label('Images'),
  communityId: string().label('Community ID').optional(),
})

const PostInputModal: React.FC<PostInputModalInterface> = ({
  visible,
  onClose,
  openBottomSheet,
  communityId,
}) => {
  const navigation = useNavigation()
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: user } = useFetchProfileQuery(userId!)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = React.useMemo(() => [40, 100], [])
  const iniTialsnapPointIndex = openBottomSheet ? 1 : 0
  const [createPost, result] = useCreatePostMutation()
  const [postText, setPostText] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const spinAnim = useRef(new Animated.Value(0)).current

  const initialValues: InferType<typeof ValidationSchema> = {
    postText: '',
    privacyType: 'public',
    postImage: [],
    communityId: communityId,
  }
  // React.useEffect(() => {
  //   if (communityId) {
  //      initialValues.communityId = communityId
  //   }
  // }, [communityId])
  // console.log('communityId', communityId)

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  // Spinning animation for loading icon
  React.useEffect(() => {
    if (result.isLoading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
      spinAnimation.start()
      return () => spinAnimation.stop()
    }
  }, [result.isLoading])

  // Handle post creation result
  React.useEffect(() => {
    if (result.isSuccess) {
      // Show success briefly, then close and navigate to feed
      setTimeout(() => {
        handleClose()
        // Navigate to the timeline/feed
        try {
          navigation.navigate(routes.TIMELINE as never)
        } catch (error) {
          console.log(
            'Navigation: Could not navigate to timeline, but post was created successfully'
          )
          // If navigation fails, at least the modal will close and the post was created
        }
      }, POST_INPUT_MODAL_CLOSE_TIMEOUT)
    }
    if (result.isError) {
      console.error(result.error)
    }
  }, [result.isSuccess, result.isError, navigation])

  const handleClose = () => {
    if (onClose) onClose()
  }

  const isPostReady = postText.trim().length > 0
  const { isDarkMode } = useTheme()

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
      // statusBarTranslucent
    >
      {/* <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" /> */}

      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Form
          validationSchema={ValidationSchema}
          initialValues={initialValues}
          onSubmit={async (values) => {
            //@ts-ignore
            await createPost(values)
          }}
          style={tw`flex-1`}
        >
          {/* Enhanced Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: isDarkMode ? 'gray-800' : 'white',
                borderBottomColor: isDarkMode
                  ? tw.color('border-primary')
                  : 'gray-200',
              },
            ]}
          >
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>

            <Text>Create Post</Text>

            <Submit
              title={result.isLoading ? 'Posting...' : 'Post'}
              size="small"
              disabled={!isPostReady || result.isLoading}
              style={[
                styles.postButton,
                isPostReady && styles.postButtonActive,
                result.isLoading && styles.postButtonLoading,
              ]}
              textStyle={[
                styles.postButtonText,
                isPostReady && styles.postButtonTextActive,
              ]}
            />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Enhanced User Section */}
            <View
              style={[
                styles.userSection,
                {
                  borderBottomColor: isDarkMode
                    ? tw.color('border-primary')
                    : 'gray-200',
                },
              ]}
            >
              <ProfAvatar
                user={user!}
                size={50}
                subtitle="Share your thoughts with the community"
                subtitleParams={{
                  textStyles: 'text-gray-500 text-sm',
                }}
              />

              <PrivacyNoticeField
                displayLong
                name="privacyType"
                canEdit={true}
                isEditing={false}
              />
            </View>

            {/* Enhanced Text Input */}
            <View style={styles.textInputSection}>
              <CustomField
                //  ref={textInputRef}
                name="postText"
                placeholder="What's on your mind?"
                autoCapitalize="sentences"
                style={styles.textInput}
                multiline={true}
                onChangeText={setPostText}
                textAlignVertical="top"
              />

              {/* Character counter */}
              <View style={styles.characterCounter}>
                <Text
                  style={[
                    styles.counterText,
                    postText.length > 280 && styles.counterWarning,
                  ]}
                >
                  {postText.length}/500
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Add Media</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Location</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Tag People</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Enhanced Bottom Sheet */}
          {/*@ts-ignore */}
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={iniTialsnapPointIndex}
            enablePanDownToClose={false}
            style={styles.bottomSheet}
            handleIndicatorStyle={styles.bottomSheetHandle}
            backgroundStyle={styles.bottomSheetBackground}
          >
            {/*@ts-ignore */}
            <BottomSheetView style={styles.bottomSheetContent}>
              <ImageFields name="postImage" />
            </BottomSheetView>
          </BottomSheet>
        </Form>

        {/* Loading Overlay */}
        {result.isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              {result.isSuccess ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={40}
                  color="#10B981"
                  style={styles.loadingIcon}
                />
              ) : (
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: spinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <MaterialCommunityIcons
                    name="loading"
                    size={40}
                    color="#3B82F6"
                    style={styles.loadingIcon}
                  />
                </Animated.View>
              )}
              <Text style={styles.loadingText}>
                {result.isSuccess
                  ? 'Post created successfully!'
                  : 'Creating your post...'}
              </Text>
              <Text style={styles.loadingSubtext}>
                {result.isSuccess
                  ? 'Your post has been shared with the community'
                  : 'Please wait while we upload your content'}
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  )
}
const CustomField = ({ onChangeText, ...props }: any) => {
  const { setFieldValue } = useFormikContext()
  return (
    <Field
      {...props}
      onChangeText={(e) => {
        setFieldValue(props.name, e)
        onChangeText(e)
      }}
    />
  )
}

export default PostInputModal
