import AsyncStorage from '@react-native-async-storage/async-storage';
import { isBefore } from 'date-fns';

import { createHabitHistory, deleteHabitHistory } from './habitHistory.storage';
import { addSchedulePushNotification, cancelSchedulePushNotifications } from './notification.storage';

import { HabitProps, StorageHabitProps, StorageHabitSortProps } from './schema.storage';

export async function saveHabit(habit: HabitProps): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habits');
        const oldHabits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        delete oldHabits[habit.id];

        const newHabit = {
            [habit.id]: habit
        };

        await AsyncStorage
            .setItem('@habtool:habits',
                JSON.stringify({
                    ...newHabit,
                    ...oldHabits
                })
            );

        await createHabitHistory(habit.id);
        await createHabitSort(habit.id, habit.order);
        await addSchedulePushNotification(habit);

    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitByName(name: string): Promise<HabitProps | undefined> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        const result = Object.values(habits).find((item) => item.name === name);

        if (result) {
            return result;
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitById(id: string): Promise<HabitProps | undefined> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        const result = Object.values(habits).find((item) => item.id === id);

        if (result) {
            return result;
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function loadHabits(): Promise<HabitProps[]> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habtool:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        const dataSort = await AsyncStorage.getItem('@habtool:habitsSorted');
        const habitsSorted = dataSort ? (JSON.parse(dataSort) as StorageHabitSortProps) : {};

        return Object
            .keys(habits)
            .map((habit) => {
                if (habits[habit].endDate && isBefore(Number(habits[habit].endDate), Date.now())) {
                    cancelSchedulePushNotifications(habits[habit].notificationIds ?? []);
                }
                return {
                    ...habits[habit],
                    order: habitsSorted[habit]
                }
            });

    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteHabit(habitId: string): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};
        const notificationIds = habits[habitId].notificationIds ?? [];

        delete habits[habitId];

        await AsyncStorage
            .setItem('@habtool:habits',
                JSON.stringify(habits)
            );

        await deleteHabitHistory(habitId);
        cancelSchedulePushNotifications(notificationIds);

    } catch (error) {
        throw new Error(error);
    }
}

//Habit Sort
export async function createHabitSort(habitId: string, position?: number): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habitsSorted');
        const habitsSorted = data ? (JSON.parse(data) as StorageHabitSortProps) : {};

        const newSort = {
            [habitId]: position ?? habitsSorted ? Object.values(habitsSorted).length + 1 : 1
        };

        await AsyncStorage
            .setItem('@habtool:habitsSorted',
                JSON.stringify({
                    ...newSort,
                    ...habitsSorted
                })
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function updateHabitsSort(order: StorageHabitSortProps): Promise<void> {
    try {
        await AsyncStorage
            .setItem('@habtool:habitsSorted',
                JSON.stringify(order)
            );

    } catch (error) {
        throw new Error(error);
    }
}