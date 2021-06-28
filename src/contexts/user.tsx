import React, { createContext, useEffect, useState } from 'react';
import { finishTransactionAsync, IAPResponseCode, setPurchaseListener } from 'expo-in-app-purchases';

import { getUser, setUser } from '../libs/storage';

interface UserContextProps {
    isPro: boolean;
    userName: string;
    handleUpdateUserName: (name: string) => void;
    handleUpdateIsPro: (value: boolean) => void;
}

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider: React.FC = ({ children }) => {
    const [userName, setUserName] = useState<string>('');
    const [isPro, setIsPro] = useState<boolean>(false);

    useEffect(() => {
        // setPurchaseListener(({ responseCode, results, errorCode }) => {
        //     if (responseCode === IAPResponseCode.OK) {
        //         results.forEach((purchase: any) => {
        //             if (!purchase.acknowledged) {
        //                 console.log(`Successfully purchased ${purchase.productId}`);
        //                 handleUpdateIsPro(true);
        //                 finishTransactionAsync(purchase, true);
        //             }
        //         });
        //     } else if (responseCode === IAPResponseCode.USER_CANCELED) {
        //         console.log('User canceled the transaction');
        //     } else if (responseCode === IAPResponseCode.DEFERRED) {
        //         console.log('User does not have permissions to buy but requested parental approval (iOS only)');
        //     } else {
        //         console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
        //     }
        // });

        async function initializeData() {
            const user = await getUser();

            setUserName(user.name);
            setIsPro(user.isPro);
        }

        initializeData();
    }, []);

    async function handleUpdateUserName(name: string) {
        const user = await getUser();

        await setUser({ ...user, name: name });
        setUserName(name);
    }

    async function handleUpdateIsPro(value: boolean) {
        const user = await getUser();

        await setUser({ ...user, isPro: value });
        setIsPro(value);
    }

    return (
        <UserContext.Provider value={{
            isPro,
            userName,
            handleUpdateUserName,
            handleUpdateIsPro
        }}>
            {children}
        </UserContext.Provider>
    )
}

