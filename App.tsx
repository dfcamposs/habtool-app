import React, { useEffect } from 'react';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from "expo-notifications";
import { LogBox } from 'react-native';

import Routes from './src/routes';
import { HabitsProvider } from './src/context/habits';
import { HabitProps } from './src/libs/storage';

export default function App() {
  LogBox.ignoreAllLogs();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.habit as HabitProps;
        console.log(data);
      }
    );

    return () => subscription.remove();
  }, [])

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_900Black
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