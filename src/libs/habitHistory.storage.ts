import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isAfter } from "date-fns";

import { addSchedulePushNotification } from "./notification.storage";
import {
    StorageHistoryHabitProps,
    StorageHabitProps,
    HabitProps
} from "./schema.storage";

export async function loadHabitsHistory(): Promise<number[]> {
    try {
        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};
        const daysChecked: number[] = [];

        Object
            .keys(habitsHistory)
            .forEach((habitId) => daysChecked.push(...habitsHistory[habitId]));

        return daysChecked.sort();

    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitWeekHistory(habitId: string): Promise<number[] | []> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        if (habitsHistory && habitsHistory[habitId]) {
            const currentDate = new Date();
            const limitDateHistory = currentDate.setDate(currentDate.getDate() - 7);

            return Object.values(habitsHistory[habitId]).filter(item => isAfter(Number(item), limitDateHistory));
        }

        return [];

    } catch (error) {
        throw new Error(error);
    }
}

export async function createHabitHistory(habitId: string): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        if (habitsHistory[habitId]) return;

        await AsyncStorage
            .setItem('@habtool:habitsHistory',
                JSON.stringify({
                    ...habitsHistory,
                    [habitId]: []
                })
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function updateHabitHistory(habit: HabitProps, date: number): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};
        const history = habitsHistory[habit.id];

        const indexDate = history
            .findIndex(item => format(Number(item), 'dd-MM-yyyy') === format(date, 'dd-MM-yyyy'));

        if (indexDate >= 0) {
            history.splice(indexDate, 1);

            await addSchedulePushNotification(habit);

            await AsyncStorage
                .setItem('@habtool:habitsHistory',
                    JSON.stringify({
                        ...habitsHistory,
                        [habit.id]: history
                    })
                );
        } else {
            await AsyncStorage
                .setItem('@habtool:habitsHistory',
                    JSON.stringify({
                        ...habitsHistory,
                        [habit.id]: [...history, date]
                    })
                );
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteHabitHistory(habitId: string): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        delete habitsHistory[habitId];

        await AsyncStorage
            .setItem('@habtool:habitsHistory',
                JSON.stringify(habitsHistory)
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function loadHabitHistoryByHabitId(habitId: string): Promise<number[]> {
    try {
        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        return habitsHistory[habitId];

    } catch (error) {
        throw new Error(error);
    }
}

export async function loadHabitsHistoryCheckedByDay(day: number): Promise<HabitProps[]> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habtool:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        return Object
            .keys(habits)
            .filter(habit =>
                habitsHistory[habit].find(item => format(item, 'dd-MM-yyyy') === format(day, 'dd-MM-yyyy')))
            .map((habit) => {
                return {
                    ...habits[habit]
                }
            });

    } catch (error) {
        throw new Error(error);
    }
}