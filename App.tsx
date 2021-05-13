import React from 'react';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black
} from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';

import Routes from './src/routes';
import { HabitsProvider } from './src/context/habits';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreAllLogs();

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_900Black
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <HabitsProvider>
      <StatusBar style="dark" />
      <Routes />
    </HabitsProvider>
  )
}