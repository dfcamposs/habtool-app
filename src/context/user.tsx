import React, { createContext, useEffect, useState } from 'react';

import { checkUserIsPro } from '../libs/storage';

interface UserContextProps {
    isPro: boolean;
}

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider: React.FC = ({ children }) => {
    const [userIsPro, setUserIsPro] = useState<boolean>(false);

    useEffect(() => {
        async function verifyUserIsPro() {
            const result = await checkUserIsPro();
            setUserIsPro(result);
        }

        verifyUserIsPro();
    }, []);

    return (
        <UserContext.Provider value={{
            isPro: userIsPro
        }}>
            {children}
        </UserContext.Provider>
    )
}

