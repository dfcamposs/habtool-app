import React, { useContext } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { HabitManager } from '../pages/HabitManager';
import { Confirmation } from '../pages/Confirmation';
import { Settings } from '../pages/Settings';
import { SortHabits } from '../pages/SortHabits';
import AuthRoutes from './tab.routes';
import { ProPurchase } from '../pages/ProPurchase';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';

const stackRoutes = createStackNavigator();

const InitialRoutes: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <stackRoutes.Navigator
            headerMode="none"
            initialRouteName="Welcome"
            screenOptions={{
                cardStyle: {
                    backgroundColor: themes[theme].backgroundPrimary,
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
    const { theme } = useContext(ThemeContext);
    return (
        <stackRoutes.Navigator
            headerMode="none"
            initialRouteName="MyHabits"
            screenOptions={{
                cardStyle: {
                    backgroundColor: themes[theme].backgroundPrimary,
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

            <stackRoutes.Screen
                name="ProPurchase"
                component={ProPurchase}
                options={{
                    ...TransitionPresets.ModalTransition
                }}
            />

        </stackRoutes.Navigator>
    )
}

export default { InitialRoutes, AppRoutes }