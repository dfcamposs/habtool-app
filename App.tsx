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
import * as Notifications from "expo-notifications";
import { LogBox } from 'react-native';

import Routes from './src/routes';
import { HabitsProvider } from './src/contexts/habits';
import { ThemeProvider } from './src/contexts/themes';
import { UserProvider } from './src/contexts/user';

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
    <UserProvider>
      <ThemeProvider>
        <HabitsProvider>
          <Routes />
        </HabitsProvider>
      </ThemeProvider>
    </UserProvider>
  )
}