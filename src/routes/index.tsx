import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackRoutes from './stack.routes';
import { UserContext } from '../contexts/user';

const Routes = () => {
    const { userName } = useContext(UserContext);

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