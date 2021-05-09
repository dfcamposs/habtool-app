import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isAfter } from 'date-fns';

export interface FrequencyProps {
    [weekDay: string]: boolean
}

export interface HabitProps {
    id: string;
    name: string;
    motivation?: string;
    frequency: FrequencyProps;
    startDate: Date;
    endDate?: Date;
    notificationHour?: Date
}

export interface StorageHabitProps {
    [id: string]: {
        data: HabitProps
        notificationId?: string;
        order?: number;
    }
}

export interface StorageHistoryHabitProps {
    [id: string]: number[]
}

export async function saveHabit(habit: HabitProps): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habits');
        const oldHabits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        const newHabit = {
            [habit.id]: {
                data: habit
            }
        };

        await AsyncStorage
            .setItem('@habto:habits',
                JSON.stringify({
                    ...newHabit,
                    ...oldHabits
                })
            );
    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitByName(name: string): Promise<HabitProps | undefined> {
    try {
        const data = await AsyncStorage.getItem('@habto:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        const result = Object.values(habits).find((item) => item.data.name === name);

        if (result) {
            return result.data;
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function loadHabits(): Promise<HabitProps[]> {
    try {
        const data = await AsyncStorage.getItem('@habto:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        return Object
            .keys(habits)
            .map((habit) => {
                return {
                    ...habits[habit].data
                }
            });
    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitWeekHistory(habitId: string): Promise<number[] | []> {
    try {
        const data = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        if (habitsHistory && habitsHistory[habitId]) {
            const currentDate = new Date();
            const limitDateHistory = currentDate.setDate(currentDate.getDate() - 6);

            return Object.values(habitsHistory[habitId]).filter(item => isAfter(Number(item), limitDateHistory));
        }

        return [];

    } catch (error) {
        throw new Error(error);
    }
}

export async function addHabitHistory(habitId: string, date: number): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        let habitHistoryUpdated: number[] = [];

        if (habitsHistory[habitId]) {
            habitHistoryUpdated = [...habitsHistory[habitId], date];
        }

        await AsyncStorage
            .setItem('@habto:habitsHistory',
                JSON.stringify({
                    ...habitsHistory,
                    [habitId]: habitHistoryUpdated
                })
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function removeHabitHistory(habitId: string, date: number): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        const findIndex = habitsHistory[habitId].findIndex(item => format(item, 'dd-MM-yyyy') === format(date, 'dd-MM-yyyy'));

        if (findIndex) {
            habitsHistory[habitId].splice(findIndex, 1);
        }

        await AsyncStorage
            .setItem('@habto:habitsHistory',
                JSON.stringify(habitsHistory)
            );

    } catch (error) {
        throw new Error(error);
    }
}