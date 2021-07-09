import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeEnum } from "../contexts/themes";

export async function getCurrentTheme(): Promise<ThemeEnum | null> {
    try {
        return await AsyncStorage.getItem('@habtool:currentTheme') as ThemeEnum;
    } catch (error) {
        throw new Error(error);
    }
}

export async function setCurrentTheme(theme: ThemeEnum): Promise<void> {
    try {
        await AsyncStorage.setItem('@habtool:currentTheme', theme);
    } catch (error) {
        throw new Error(error);
    }
}