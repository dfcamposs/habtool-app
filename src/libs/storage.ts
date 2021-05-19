import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isAfter } from 'date-fns';
import * as Notifications from "expo-notifications";

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

export interface HabitHistoryProps {
    habit: HabitProps,
    history: number[]
}

export interface StorageHabitProps {
    [id: string]: HabitProps
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

export function formatWeekDay(weekDay: number): string | undefined {
    if (weekDay === 0) return "sun";
    if (weekDay === 1) return "mon";
    if (weekDay === 2) return "tue";
    if (weekDay === 3) return "wed";
    if (weekDay === 4) return "thu";
    if (weekDay === 5) return "fri";
    if (weekDay === 6) return "sat";
}

export async function addSchedulePushNotification(habit: HabitProps): Promise<void> {
    const schedule = habit.notificationHour;

    if (!schedule) return;

    for (let i = 0; i < 7; i++) {
        const weekDay = formatWeekDay(i);
        if (!weekDay) continue;

        if (habit.frequency[weekDay]) {
            const notification = await Notifications.scheduleNotificationAsync({
                identifier: habit.id,
                content: {
                    title: habit.name,
                    body: habit.motivation ?? 'Já executou este hábito hoje?',
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        habit
                    }
                },
                trigger: {
                    hour: Number(format(schedule, "HH")),
                    minute: Number(format(schedule, "mm")),
                    repeats: true,
                    weekday: i
                },
            });
            console.log("push notification: ", notification);
        }
    }
}

export async function cancelSchedulePushNotification(habitId: string) {
    await Notifications.dismissNotificationAsync(habitId);
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
        cancelSchedulePushNotification(habit.id);

        const newHabit = {
            [habit.id]: habit
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
        await addSchedulePushNotification(habit);

    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitByName(name: string): Promise<HabitProps | undefined> {
    try {
        const data = await AsyncStorage.getItem('@habto:habits');
        const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

        const result = Object.values(habits).find((item) => item.name === name);

        if (result) {
            return result;
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
                    ...habits[habit]
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

        if (habitsHistory[habitId]) return;

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

        const countHabitsToday = Object.values(habits).filter(item => item.frequency[weekDay] && !item.endDate).length;

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

export async function loadHabitsHistory(): Promise<HabitHistoryProps[]> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habto:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        const dataHistory = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        return Object
            .keys(habits)
            .map((habit) => {
                return {
                    habit: { ...habits[habit] },
                    history: [...habitsHistory[habit]]
                }
            });

    } catch (error) {
        throw new Error(error);
    }
}

export async function loadHabitsHistoryCheckedByDay(day: number): Promise<HabitProps[]> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habto:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        const dataHistory = await AsyncStorage.getItem('@habto:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        return Object
            .keys(habits)
            .filter(habit => habitsHistory[habit].includes(day))
            .map((habit) => {
                return {
                    ...habits[habit]
                }
            });

    } catch (error) {
        throw new Error(error);
    }
}