import React, { forwardRef, useMemo } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

import { ImageFields } from 'components/form'
import { useMediaUploads } from '../../useMediaUploads'
import { styles } from '../style'
import PresignMediaPicker from './PresignMediaPicker'

const PRESIGN_ENABLED = process.env.EXPO_PUBLIC_USE_PRESIGN_UPLOAD === 'true'

interface Props {
  openIndex?: number
  mediaUploads: ReturnType<typeof useMediaUploads>
}

const PostMediaSheet = forwardRef<BottomSheet, Props>(
  ({ openIndex = 0, mediaUploads }, ref) => {
    const snapPoints = useMemo(() => [80, 100], [])

    return (
      // @ts-ignore
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={openIndex}
        enablePanDownToClose={false}
        style={styles.bottomSheet}
        handleIndicatorStyle={styles.bottomSheetHandle}
        backgroundStyle={styles.bottomSheetBackground}
      >
        {/* @ts-ignore */}
        <BottomSheetView style={styles.bottomSheetContent}>
          {PRESIGN_ENABLED ? (
            <PresignMediaPicker mediaUploads={mediaUploads} />
          ) : (
            <ImageFields name="postImage" />
          )}
        </BottomSheetView>
      </BottomSheet>
    )
  }
)

PostMediaSheet.displayName = 'PostMediaSheet'

export default PostMediaSheet
