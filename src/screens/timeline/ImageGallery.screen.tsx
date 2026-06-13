import React, { useEffect, useState, useRef } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { Video, ResizeMode } from 'expo-av'

import tw from 'lib/tailwind'
import LikeForm from 'components/LikeForm'
import CommentForm, { CommentFormHandle } from 'components/CommentForm'
import { FeedStackParams } from '../../../types'

import { setTabBarVisibility } from 'store/ui-slice'
import { useDispatch } from 'react-redux'
import { useToggleKoreMutation } from 'store/post'
import { cdnImageUrl } from '../../lib/cdnImageUrl'

const IMG_SIZE = 80
const SPACING = 10
const { width, height } = Dimensions.get('screen')

type GalleryScreenRouteProp = RouteProp<FeedStackParams, 'Gallery'>

const ImageGallery: React.FC = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute<GalleryScreenRouteProp>()
  const [toggleKore] = useToggleKoreMutation()
  const handleLike = async (id: string) => {
    await toggleKore(id).unwrap()
  }
  const images = route.params?.media || []

  const [activeIndex, setActiveIndex] = React.useState(
    //@ts-ignore
    route?.params?.initialSlide || 0
  )
  const [modalVisible, setModalVisible] = useState(false)
  const commentFormRef = useRef<CommentFormHandle>(null)

  useEffect(() => {
    dispatch(setTabBarVisibility(false))
    return () => {
      dispatch(setTabBarVisibility(true))
    }
  }, [])

  const topRef = React.useRef<FlatList>(null)
  const thumbRef = React.useRef<FlatList>(null)

  const scrollToActiveIndex = (index: number) => {
    setActiveIndex(index)

    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    })

    if (index * IMG_SIZE - IMG_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMG_SIZE + SPACING) - width / 2 + IMG_SIZE / 2,
        animated: true,
      })
    }
  }

  const handleOpenComments = () => {
    setModalVisible(true)

    setTimeout(() => {
      commentFormRef.current?.focus()
    }, 100)
  }

  // Check if video support is available
  const hasVideoSupport = () => {
    try {
      require('expo-av')
      return true
    } catch {
      return false
    }
  }

  // Helper function to determine if the URI is a video
  const isVideo = (uri: string) => {
    return (
      uri &&
      (uri.includes('.mp4') ||
        uri.includes('.mov') ||
        uri.includes('.avi') ||
        uri.includes('video') ||
        uri.includes('.webm'))
    )
  }

  return (
    <View style={tw`flex-1 `}>
      <View style={tw`flex-1 relative`}>
        <FlatList
          ref={topRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(ev) => {
            const index = Math.floor(ev.nativeEvent.contentOffset.x / width)
            setActiveIndex(index)

            // Auto-scroll thumbnail list to keep active item visible
            if (index * IMG_SIZE - IMG_SIZE / 2 > width / 2) {
              thumbRef?.current?.scrollToOffset({
                offset: index * (IMG_SIZE + SPACING) - width / 2 + IMG_SIZE / 2,
                animated: true,
              })
            } else {
              // If we're at the beginning, scroll thumbnail list to start
              thumbRef?.current?.scrollToOffset({
                offset: 0,
                animated: true,
              })
            }
          }}
          renderItem={({ item }) => (
            <View style={{ width, height }}>
              {hasVideoSupport() && isVideo(item.original) ? (
                <Video
                  //   source={{ uri: item.original }}
                  source={{
                    uri:
                      cdnImageUrl(item.original, {
                        width: 1280, // 2x for retina
                        height: 720,
                        smartCrop: true,
                      }) ?? item.original,
                  }}
                  style={[StyleSheet.absoluteFillObject]}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={true}
                  isLooping={true}
                  isMuted={false}
                  useNativeControls
                />
              ) : (
                <Image
                  source={{ uri: item.original }}
                  style={[StyleSheet.absoluteFillObject]}
                />
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <FlatList
          ref={thumbRef}
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ position: 'absolute', bottom: 20 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                scrollToActiveIndex(index)
              }}
            >
              <View style={{ position: 'relative' }}>
                {hasVideoSupport() && isVideo(item.original) ? (
                  <>
                    <Video
                      source={{ uri: item.original }}
                      style={{
                        width: IMG_SIZE,
                        height: IMG_SIZE,
                        borderRadius: SPACING,
                        marginBottom: 10,
                        marginRight: 10,
                        borderWidth: 2,
                        borderColor:
                          activeIndex === index ? 'white' : 'transparent',
                      }}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false}
                      isMuted={true}
                    />
                    {/* Video play icon overlay for thumbnail */}
                    <View
                      style={[
                        StyleSheet.absoluteFillObject,
                        {
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: SPACING,
                          marginBottom: 10,
                          marginRight: 10,
                        },
                      ]}
                    >
                      <View style={tw`bg-black bg-opacity-50 rounded-full p-1`}>
                        <MaterialCommunityIcons
                          name="play"
                          size={16}
                          color="white"
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <Image
                    source={{ uri: item.original }}
                    style={{
                      width: IMG_SIZE,
                      height: IMG_SIZE,
                      borderRadius: SPACING,
                      marginBottom: 10,
                      marginRight: 10,
                      borderWidth: 2,
                      borderColor:
                        activeIndex === index ? 'white' : 'transparent',
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={tw`absolute bottom-[${IMG_SIZE * 2}px] right-2 `}>
          <View
            style={tw`bg-white bg-opacity-50 items-center justify-center rounded-full w-10 h-10 mb-2`}
          >
            <LikeForm
              id={route.params.id.toString()}
              isReactor={route.params.isReactor || false}
              likersCount={route.params.amountOfKorems}
              size={20}
              flexDir="row"
              onLike={handleLike}
            />
          </View>

          <TouchableOpacity
            onPress={handleOpenComments}
            style={tw`bg-white bg-opacity-50 items-center justify-center
            rounded-full w-10 h-10`}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Close button moved outside the main container */}
      <Pressable
        onPress={() => {
          navigation.goBack()
        }}
        style={({ pressed }) => [
          {
            position: 'absolute',
            top: 50,
            right: 20,
            width: 50,
            height: 50,
            backgroundColor: pressed
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.8)',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            elevation: 10,
          },
        ]}
        // hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      >
        <MaterialCommunityIcons name="close" color="black" size={28} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <CommentForm
          ref={commentFormRef}
          off={10}
          postId={route.params?.id!.toString()}
          onSubmit={() => {
            setModalVisible(false)
          }}
        />
      </Modal>
    </View>
  )
}

export default ImageGallery
