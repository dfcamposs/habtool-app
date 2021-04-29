import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { MyHabits } from '../pages/MyHabits';
import { HabitManager } from '../pages/HabitManager';
import { Progress } from '../pages/Progress';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
    return (
        <AppTab.Navigator
            tabBarOptions={{
                activeTintColor: colors.blue,
                inactiveTintColor: colors.textUnfocus,
                labelPosition: 'beside-icon',
                labelStyle: {
                    fontSize: 14,
                    fontFamily: fonts.content
                },
                style: {
                    paddingHorizontal: 10,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: Platform.OS === 'ios' ? 80 : 60
                }
            }}
        >

            <AppTab.Screen
                name="adicionar"
                component={HabitManager}
                options={{
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
                name="progresso"
                component={Progress}
                options={{
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