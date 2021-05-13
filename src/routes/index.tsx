import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackRoutes from './stack.routes';
import { HabitsContext } from '../context/habits';

const Routes = () => {
    const { userName } = useContext(HabitsContext);

    return (
        <NavigationContainer>
            {userName
                ? <StackRoutes.AppRoutes />
                : <StackRoutes.InitialRoutes />
            }
        </NavigationContainer>
    )
}


export default Routes;