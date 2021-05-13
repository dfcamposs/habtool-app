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
    startDate: number;
    endDate?: number;
    notificationHour?: number;
}

export interface StorageHabitProps {
    [id: string]: {
        data: HabitProps
        notificationId?: string;
    }
}

export interface StorageHistoryHabitProps {
    [id: string]: number[]
}

export interface StorageUserProps {
    [name: string]: string;
}

export interface StorageHabitSortProps {
    [id: string]: number;
}

export async function saveUserName(name: string): Promise<void> {
    try {
        await AsyncStorage
            .setItem('@habto:user',
                JSON.stringify({
                    name: name
                })
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserName(): Promise<string> {
    try {
        const data = await AsyncStorage.getItem('@habto:user');
        const user = data ? (JSON.parse(data) as StorageUserProps) : {};

        if (user) {
            return user.name;
        } else {
            throw new Error("Nome do usuário não encontrado");
        }

    } catch (error) {
        throw new Error(error);
    }
}

export async function saveHabit(habit: HabitProps): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habits');
        const oldHabits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        delete oldHabits[habit.id];

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

        await createHabitHistory(habit.id);
        await createHabitSort(habit.id);

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
        const data = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        await AsyncStorage
            .setItem('@habto:habitsHistory',
                JSON.stringify({
                    ...habitsHistory,
                    [habitId]: []
                })
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function updateHabitHistory(habitId: string, date: number): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};
        const history = habitsHistory[habitId];

        const indexDate = history
            .findIndex(item => format(Number(item), 'dd-MM-yyyy') === format(date, 'dd-MM-yyyy'));

        if (indexDate >= 0) {
            history.splice(indexDate, 1);

            await AsyncStorage
                .setItem('@habto:habitsHistory',
                    JSON.stringify({
                        ...habitsHistory,
                        [habitId]: history
                    })
                );
        } else {
            await AsyncStorage
                .setItem('@habto:habitsHistory',
                    JSON.stringify({
                        ...habitsHistory,
                        [habitId]: [...history, date]
                    })
                );
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function getProgressStars(): Promise<number> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habto:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        if (!Object.values(habits).length) {
            return 0;
        }

        const dataHistory = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        const currentDate = new Date();
        const weekDay = format(currentDate.setDate(currentDate.getDate()), 'E').toLocaleLowerCase();

        const countHabitsToday = Object.values(habits).filter(item => item.data.frequency[weekDay] && !item.data.endDate).length;

        if (countHabitsToday === 0) {
            return 100;
        }

        const countHabitsCheckedToday = Object
            .values(habitsHistory)
            .map(item => item.map(item2 => format(Number(item2), 'dd-MM-yyyy')))
            .filter(item => item.includes(format(currentDate.setDate(currentDate.getDate()), 'dd-MM-yyyy')))
            .length;

        return (countHabitsCheckedToday * 100) / countHabitsToday;

    } catch (error) {
        throw new Error();
    }
}

export async function deleteHabit(habitId: string): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        delete habits[habitId];

        await AsyncStorage
            .setItem('@habto:habits',
                JSON.stringify(habits)
            );

        await deleteHabitHistory(habitId);

    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteHabitHistory(habitId: string): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};

        delete habitsHistory[habitId];

        await AsyncStorage
            .setItem('@habto:habitsHistory',
                JSON.stringify(habitsHistory)
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function createHabitSort(habitId: string): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habto:habitsSorted');
        const habitsSorted = data ? (JSON.parse(data) as StorageHabitSortProps) : {};

        const newSort = {
            [habitId]: habitsSorted ? Object.values(habitsSorted).length + 1 : 1
        };

        await AsyncStorage
            .setItem('@habto:habitsSorted',
                JSON.stringify({
                    ...newSort,
                    ...habitsSorted
                })
            );

    } catch (error) {
        throw new Error(error);
    }
}

export async function updateHabitsSorted(order: StorageHabitSortProps): Promise<void> {
    try {
        await AsyncStorage
            .setItem('@habto:habitsSorted',
                JSON.stringify(order)
            );

    } catch (error) {
        throw new Error(error);
    }
}