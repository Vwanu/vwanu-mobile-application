import tw from 'lib/tailwind'

export type CardSize = 'small' | 'extra-small' | 'large' | 'xl'

export interface SizeVariant {
  card: ReturnType<typeof tw>
  title: ReturnType<typeof tw>
  titleMaxLength?: number
  descriptionMaxLength?: number
  showDescription: boolean
  showJoin: boolean
  showTitleShowMore: boolean
}

export const SIZE_VARIANTS: Record<CardSize, SizeVariant> = {
  small: {
    card: tw`rounded-2xl overflow-hidden h-40 w-47`,
    title: tw`text-white text-base font-bold mb-2 leading-5`,
    titleMaxLength: 20,
    descriptionMaxLength: 10,
    showDescription: true,
    showJoin: true,
    showTitleShowMore: true,
  },
  'extra-small': {
    card: tw`rounded-2xl overflow-hidden h-32 w-48`,
    title: tw`text-white font-bold my-2 leading-4`,
    titleMaxLength: 50,
    showDescription: false,
    showJoin: false,
    showTitleShowMore: false,
  },
  large: {
    card: tw`rounded-3xl overflow-hidden h-60 w-full`,
    title: tw`text-white text-2xl font-bold mb-2 leading-6`,
    descriptionMaxLength: 150,
    showDescription: true,
    showJoin: true,
    showTitleShowMore: true,
  },
  xl: {
    card: tw`rounded-3xl overflow-hidden h-80 w-full`,
    title: tw`text-white text-2xl font-bold mb-2 leading-6`,
    descriptionMaxLength: 150,
    showDescription: true,
    showJoin: true,
    showTitleShowMore: true,
  },
}
