import { StatusBar } from 'expo-status-bar';
import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { checkUserIsPro } from '../libs/storage';

export enum ThemeEnum {
    light = "light",
    dark = "dark"
}

interface ThemeContextProps {
    theme: ThemeEnum;
    setTheme: (theme: ThemeEnum) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider: React.FC = ({ children }) => {
    const [theme, setTheme] = useState<ThemeEnum>(ThemeEnum.dark);

    const deviceTheme = useColorScheme();

    useEffect(() => {
        async function setDefaultTheme() {
            const userIsPro = await checkUserIsPro();
            if (userIsPro && deviceTheme)
                setTheme(ThemeEnum[deviceTheme]);
        }

        setDefaultTheme();
    }, [])

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme
        }}>
            <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
            {children}
        </ThemeContext.Provider>
    )
}

