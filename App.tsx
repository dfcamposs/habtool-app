import React, { useEffect } from 'react';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
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

export default function App() {
  LogBox.ignoreAllLogs();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });
    return () => subscription.remove();
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
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