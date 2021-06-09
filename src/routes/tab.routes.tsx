import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { MyHabits } from '../pages/MyHabits';
import { HabitManager } from '../pages/HabitManager';
import { Progress } from '../pages/Progress';

import { ThemeContext } from '../context/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <AppTab.Navigator
            initialRouteName="hábitos"
            backBehavior="initialRoute"
            tabBarOptions={{
                activeTintColor: themes[theme].blue,
                inactiveTintColor: themes[theme].textUnfocus,
                labelPosition: 'beside-icon',
                labelStyle: {
                    fontSize: 15,
                    fontFamily: fonts.complement
                },
                style: {
                    backgroundColor: themes[theme].backgroundTertiary,
                    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
                    height: Platform.OS === 'ios' ? 80 : 60
                }
            }}
        >

            <AppTab.Screen
                name="hábitos"
                component={MyHabits}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="calendar-view-day"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <AppTab.Screen
                name="adicionar"
                component={HabitManager}
                initialParams={{}}
                listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })}
                options={{
                    unmountOnBlur: true,
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="add-circle"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <AppTab.Screen
                name="progresso"
                component={Progress}
                listeners={({ navigation }) => ({
                    blur: () => navigation.setParams({ screen: undefined }),
                })}
                options={{
                    unmountOnBlur: true,
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="poll"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

        </AppTab.Navigator>
    )
}

export default AuthRoutes;