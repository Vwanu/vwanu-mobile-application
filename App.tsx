import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import * as eva from '@eva-design/eva'
import { Provider } from 'react-redux'
import { Amplify } from 'aws-amplify'
import { ApplicationProvider } from '@ui-kitten/components'
import { Authenticator } from '@aws-amplify/ui-react-native'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import {
  Syne_400Regular,
  Syne_500Medium,
  Syne_600SemiBold,
  Syne_700Bold,
  Syne_800ExtraBold,
} from '@expo-google-fonts/syne'

import Routes from './src/navigation'
import { store } from './src/store'
import mapping from './src/mapping.json'
import amplifyconfig from './src/amplifyconfiguration.json'
import { MessageProvider } from './src/contexts/MessageContext'
import { ScrollProvider } from 'contexts/ScrollContext'
import { useTheme } from './src/hooks/useTheme'

Amplify.configure(amplifyconfig)

SplashScreen.preventAutoHideAsync().catch(() => {})

// Theme wrapper component that has access to Redux state
const ThemedApp: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme()

  // Create custom navigation theme
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: currentTheme['background-basic-color-1'],
      card: currentTheme['background-basic-color-2'],
      text: currentTheme['text-basic-color'],
      border: currentTheme['border-basic-color-1'],
      primary: currentTheme['color-primary-500'],
    },
  }

  return (
    <ApplicationProvider
      {...eva}
      customMapping={mapping as any}
      theme={currentTheme}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Authenticator.Provider>
        <MessageProvider>
          <NavigationContainer theme={navigationTheme}>
            <ScrollProvider>
              <Routes />
            </ScrollProvider>
          </NavigationContainer>
        </MessageProvider>
      </Authenticator.Provider>
    </ApplicationProvider>
  )
}

const App: React.FC = () => {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Syne_400Regular,
    Syne_500Medium,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {})
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemedApp />
        </SafeAreaProvider>
      </Provider>
    </View>
  )
}

export default App
