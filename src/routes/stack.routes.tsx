import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { HabitManager } from '../pages/HabitManager';
import { Confirmation } from '../pages/Confirmation';
import { Settings } from '../pages/Settings';
import { SortHabits } from '../pages/SortHabits';
import AuthRoutes from './tab.routes';

import colors from '../styles/colors';

const stackRoutes = createStackNavigator();

const InitialRoutes: React.FC = () => {
    return (
        <stackRoutes.Navigator
            headerMode="none"
            initialRouteName="Welcome"
            screenOptions={{
                cardStyle: {
                    backgroundColor: colors.background,
                }
            }}
        >
            <stackRoutes.Screen
                name="Welcome"
                component={Welcome}
            />

            <stackRoutes.Screen
                name="AppRoutes"
                component={AppRoutes}
            />
        </stackRoutes.Navigator>
    )
}

const AppRoutes: React.FC = () => {
    return (
        <stackRoutes.Navigator
            headerMode="none"
            initialRouteName="MyHabits"
            screenOptions={{
                cardStyle: {
                    backgroundColor: colors.background,
                }
            }}
        >
            <stackRoutes.Screen
                name="MyHabits"
                component={AuthRoutes}
            />

            <stackRoutes.Screen
                name="EditHabit"
                component={HabitManager}
            />

            <stackRoutes.Screen
                name="Confirmation"
                component={Confirmation}
            />

            <stackRoutes.Screen
                name="Settings"
                component={Settings}
            />

            <stackRoutes.Screen
                name="Rename"
                component={Welcome}
            />

            <stackRoutes.Screen
                name="SortHabits"
                component={SortHabits}
            />

            <stackRoutes.Screen
                name="AppRoutes"
                component={AuthRoutes}
            />

        </stackRoutes.Navigator>
    )
}

export default { InitialRoutes, AppRoutes }