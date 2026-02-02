import { ConfigContext, ExpoConfig } from 'expo/config'
import { version } from './package.json'

// Replace these with your EAS project ID and project slug.
// You can find them at https://expo.dev/accounts/[account]/projects/[project].
const EAS_PROJECT_ID = 'e550dc60-d34d-4c1d-8286-c670002c81d3'
const PROJECT_SLUG = 'vwanu-app'
const OWNER = 'waddprog'

// App production config
const APP_NAME = 'Vwanu'
const BUNDLE_IDENTIFIER = 'com.webvitals.vwanu'
const PACKAGE_NAME = 'com.webvitals.vwanu'
const ADAPTIVE_ICON = './src/assets/images/icons/Android-Prod.png'
const SCHEME = 'vwanu'

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log('⚙️ Building app for environment:', process.env.APP_ENV)

  const environment =
    (process.env.APP_ENV as 'development' | 'preview' | 'production') ||
    'development'
  const {
    name,
    bundleIdentifier,
    ios,
    android,
    adaptiveIcon,
    packageName,
    scheme,
  } = getDynamicAppConfig(environment)

  return {
    ...config,
    name: name,
    version, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    scheme: scheme,
    ios,
    android,
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you share them with your friends.',
        },
      ],
      'expo-secure-store',
      [
        'expo-font',
        {
          fonts: [
            'node_modules/@expo-google-fonts/poppins/900Black/Poppins_900Black.ttf',
            'node_modules/@expo-google-fonts/poppins/900Black_Italic/Poppins_900Black_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/800ExtraBold/Poppins_800ExtraBold.ttf',
            'node_modules/@expo-google-fonts/poppins/800ExtraBold_Italic/Poppins_800ExtraBold_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf',
            'node_modules/@expo-google-fonts/poppins/700Bold_Italic/Poppins_700Bold_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/poppins/600SemiBold_Italic/Poppins_600SemiBold_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf',
            'node_modules/@expo-google-fonts/poppins/500Medium_Italic/Poppins_500Medium_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf',
            'node_modules/@expo-google-fonts/poppins/400Regular_Italic/Poppins_400Regular_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/300Light/Poppins_300Light.ttf',
            'node_modules/@expo-google-fonts/poppins/300Light_Italic/Poppins_300Light_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/200ExtraLight/Poppins_200ExtraLight.ttf',
            'node_modules/@expo-google-fonts/poppins/200ExtraLight_Italic/Poppins_200ExtraLight_Italic.ttf',
            'node_modules/@expo-google-fonts/poppins/100Thin/Poppins_100Thin.ttf',
            'node_modules/@expo-google-fonts/poppins/100Thin_Italic/Poppins_100Thin_Italic.ttf',
            // Inter fonts
            'node_modules/@expo-google-fonts/inter/100Thin/Inter_100Thin.ttf',
            'node_modules/@expo-google-fonts/inter/200ExtraLight/Inter_200ExtraLight.ttf',
            'node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf',
            'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
            'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
            'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
            'node_modules/@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf',
            'node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf',
          ],
        },
      ],
      createSplashScreenConfig(environment),
    ],
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    web: {
      bundler: 'metro',
      favicon: './src/assets/images/favicon.png',
    },

    owner: OWNER,
  }
}

// Helper function to generate iOS icon configuration
const createIOSIconConfig = (environment: string) => ({
  dark: `./src/assets/images/icons/ios/dark/${environment}/logo.png`,
  light: `./src/assets/images/icons/ios/light/${environment}/logo.png`,
  tinted: `./src/assets/images/icons/ios/tinted/${environment}/logo.png`,
})

// Helper function to generate Android adaptive icon configuration
const createAndroidAdaptiveIcon = () => ({
  foregroundImage: './src/assets/images/icons/android/logo.png',
  monochromeImage: './src/assets/images/icons/android/logo.png',
  backgroundImage: './src/assets/images/icons/android/logo.png',
  backgroundColor: '#ffffff',
})

// Helper function to generate splash screen configuration
const createSplashScreenConfig = (environment: string): [string, any] => [
  'expo-splash-screen',
  {
    image: `./src/assets/images/icons/splash/light/splash.png`,
    imageWidth: 200,
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
    dark: {
      image: `./src/assets/images/icons/splash/dark/splash.png`,
      imageWidth: 200,
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
  },
]

// Environment configuration mapping
const ENVIRONMENT_CONFIG = {
  production: {
    nameSuffix: '',
    identifierSuffix: '',
    schemeSuffix: '',
    supportsTablet: true,
    adaptiveIcon: ADAPTIVE_ICON,
  },
  preview: {
    nameSuffix: ' Preview',
    identifierSuffix: '.preview',
    schemeSuffix: '-prev',
    supportsTablet: true,
    adaptiveIcon: './src/assets/images/icons/Android-Prev.png',
  },
  development: {
    nameSuffix: ' Development',
    identifierSuffix: '.dev',
    schemeSuffix: '-dev',
    supportsTablet: true,
    adaptiveIcon: './src/assets/images/icons/Android-Dev.png',
  },
} as const

export const getDynamicAppConfig = (
  environment: 'development' | 'preview' | 'production'
) => {
  const config = ENVIRONMENT_CONFIG[environment]
  const bundleIdentifier = `${BUNDLE_IDENTIFIER}${config.identifierSuffix}`
  const packageName = `${PACKAGE_NAME}${config.identifierSuffix}`

  return {
    name: `${APP_NAME}${config.nameSuffix}`,
    bundleIdentifier,
    packageName,
    adaptiveIcon: config.adaptiveIcon,
    scheme: `${SCHEME}${config.schemeSuffix}`,
    ios: {
      supportsTablet: config.supportsTablet,
      bundleIdentifier,
      icon: createIOSIconConfig(environment),
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: packageName,
      adaptiveIcon: createAndroidAdaptiveIcon(),
    },
  }
}
