import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { HabitManager } from '../pages/HabitManager';
import AuthRoutes from './tab.routes';

import colors from '../styles/colors';


const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        headerMode="none"
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
            name="CreateHabit"
            component={AuthRoutes}
        />

        <stackRoutes.Screen
            name="EditHabit"
            component={HabitManager}
        />

        <stackRoutes.Screen
            name="MyHabits"
            component={AuthRoutes}
        />

        <stackRoutes.Screen
            name="Progress"
            component={AuthRoutes}
        />

    </stackRoutes.Navigator>
)

export default AppRoutes;