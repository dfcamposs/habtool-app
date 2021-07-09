import AsyncStorage from "@react-native-async-storage/async-storage";

import { StorageUserProps } from "./schema.storage";

export async function setUser(user: StorageUserProps): Promise<void> {
    try {
        await AsyncStorage.setItem('@habtool:user', JSON.stringify(user));
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUser(): Promise<StorageUserProps> {
    try {
        const data = await AsyncStorage.getItem('@habtool:user');
        const user = data && JSON.parse(data) as StorageUserProps;

        if (user) {
            return user;
        } else {
            const newUser = { name: '', isPro: false };
            await setUser(newUser);
            return newUser;
        }

    } catch (error) {
        throw new Error(error);
    }
}