export const colors = {
  warmBg: '#F5F3EE',
  warmSurface: '#FFFFFF',
  warmBorder: '#E4E2DC',
  warmBorderStrong: '#D4D1C8',
  warmDim: '#C0BEB8',
  ink: '#1A1A2E',
  soft: '#4A4A5E',
  mute: '#8A8A9E',
  primaryDeep: '#1B1F5E',
  primaryDeep2: '#2B3180',
  primarySoft: '#EEF0FA',
  coral: '#F76C5E',
  amber: '#F4A300',
  amberDeep: '#C58400',
  amberSoft: '#FDF0D6',
} as const

export const fonts = {
  poppinsRegular: 'Poppins_400Regular',
  poppinsMedium: 'Poppins_500Medium',
  poppinsSemibold: 'Poppins_600SemiBold',
  poppinsBold: 'Poppins_700Bold',
  syneRegular: 'Syne_400Regular',
  syneMedium: 'Syne_500Medium',
  syneSemibold: 'Syne_600SemiBold',
  syneBold: 'Syne_700Bold',
  syneExtrabold: 'Syne_800ExtraBold',
} as const

export const radii = {
  card: 16,
  pill: 9999,
} as const

export const cardShadow = {
  shadowColor: colors.ink,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 3,
  elevation: 2,
} as const
