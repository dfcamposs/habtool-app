import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { getCurrentTheme, getUser, setCurrentTheme } from '../libs/storage';
import { UserContext } from './user';

export enum ThemeEnum {
    default = "default",
    light = "light",
    dark = "dark"
}

interface ThemeContextProps {
    theme: ThemeEnum;
    handleChange: (theme: ThemeEnum) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider: React.FC = ({ children }) => {
    const [theme, setTheme] = useState<ThemeEnum>(ThemeEnum.light);
    const deviceTheme = useColorScheme();

    useEffect(() => {
        async function setInitialTheme() {
            const { isPro } = await getUser();
            const currentTheme = await getCurrentTheme();

            if (!isPro) {
                return;
            }

            if (currentTheme) {
                if (currentTheme === ThemeEnum.default && deviceTheme) {
                    setTheme(ThemeEnum[deviceTheme]);
                } else {
                    setTheme(currentTheme);
                }
            }
        }


        setInitialTheme();
    }, []);

    function handleChange(theme: ThemeEnum) {
        if (theme === ThemeEnum.default) {
            setTheme(deviceTheme ? ThemeEnum[deviceTheme] : ThemeEnum.light);
        } else {
            setTheme(theme);
        }

        setCurrentTheme(theme);
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            handleChange
        }}>
            <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
            {children}
        </ThemeContext.Provider>
    )
}

