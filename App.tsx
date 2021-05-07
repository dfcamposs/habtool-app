import React from 'react';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold
} from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';

import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      <StatusBar style="dark" />
      <Routes />
    </>
  )
}