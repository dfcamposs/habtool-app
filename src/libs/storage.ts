import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isAfter, isBefore } from 'date-fns';
import * as Notifications from "expo-notifications";
import { ColorEnum } from '../components/ColorTrackList';
import { ThemeEnum } from '../contexts/themes';
import { calculateSequence } from '../utils/date';

//Models
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
    notificationHours: number[];
    order: number;
    trackColor?: ColorEnum,
    notificationIds?: string[];
}

export interface HabitHistoryProps {
    habit: HabitProps,
    history: number[]
}

export interface HabitScoreProps {
    currentSequence: number;
    bestSequence: number;
    doneCount: number;
}

export interface StorageHabitProps {
    [id: string]: HabitProps
}

export interface StorageHistoryHabitProps {
    [id: string]: number[]
}

export interface StorageUserProps {
    name: string;
    isPro: boolean;
}

export interface StorageHabitSortProps {
    [id: string]: number;
}

//Formats
export function formatWeekDay(weekDay: number): string | undefined {
    if (weekDay === 1) return "sun";
    if (weekDay === 2) return "mon";
    if (weekDay === 3) return "tue";
    if (weekDay === 4) return "wed";
    if (weekDay === 5) return "thu";
    if (weekDay === 6) return "fri";
    if (weekDay === 7) return "sat";
}


//Notifications
export async function addSchedulePushNotification(habit: HabitProps): Promise<void> {
    const schedules = habit.notificationHours;
    const newNotifications: string[] = [];

    if (!schedules?.length) return;

    if (habit.notificationIds) {
        await cancelSchedulePushNotifications(habit.notificationIds);
    }

    for (let i = 1; i <= 7; i++) {
        const weekDay = formatWeekDay(i);
        if (!weekDay) continue;

        if (habit.frequency[weekDay]) {
            for (const schedule of schedules) {
                const notificationId = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: habit.name,
                        body: habit.motivation ?? 'Já executou este hábito hoje?',
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                    },
                    trigger: {
                        hour: Number(format(schedule, "HH")),
                        minute: Number(format(schedule, "mm")),
                        repeats: true,
                        weekday: i
                    },
                });

                newNotifications.push(notificationId);
            }
        }
    }

    console.log(newNotifications);

    const data = await AsyncStorage.getItem('@habtool:habits');
    const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

    await AsyncStorage
        .setItem('@habtool:habits',
            JSON.stringify({
                [habit.id]: {
                    ...habits[habit.id],
                    notificationIds: newNotifications
                },
                ...habits
            })
        );
}

export async function cancelSchedulePushNotifications(notificationIds: string[]) {
    notificationIds.forEach(notification => Notifications.cancelScheduledNotificationAsync(notification));
}


//User
export async function setUser(user: StorageUserProps): Promise<void> {
    try {
        await AsyncStorage
            .setItem('@habtool:user',
                JSON.stringify({
                    name: user.name.trim()
                })
            );
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

//Theme
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

//Habit
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


//History Habits
export async function loadHabitsHistory(): Promise<HabitHistoryProps[]> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habtool:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
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

export async function updateHabitHistory(habitId: string, date: number): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = data ? (JSON.parse(data) as StorageHistoryHabitProps) : {};
        const history = habitsHistory[habitId];

        const indexDate = history
            .findIndex(item => format(Number(item), 'dd-MM-yyyy') === format(date, 'dd-MM-yyyy'));

        if (indexDate >= 0) {
            history.splice(indexDate, 1);

            const habit = await getHabitById(habitId);
            habit && await addSchedulePushNotification(habit);

            await AsyncStorage
                .setItem('@habtool:habitsHistory',
                    JSON.stringify({
                        ...habitsHistory,
                        [habitId]: history
                    })
                );
        } else {
            await AsyncStorage
                .setItem('@habtool:habitsHistory',
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

//Stars Progress
export async function getProgressStars(): Promise<number> {
    try {
        const dataHabits = await AsyncStorage.getItem('@habtool:habits');
        const habits = dataHabits ? (JSON.parse(dataHabits) as StorageHabitProps) : {};

        if (!Object.values(habits).length) {
            return 0;
        }

        const currentDate = new Date();
        const weekDay = format(currentDate.setDate(currentDate.getDate()), 'E').toLocaleLowerCase();

        const habitsToday = Object.keys(habits).filter(item =>
            habits[item].frequency[weekDay]
            && (!habits[item].endDate || isAfter(Number(habits[item].endDate), Date.now())));

        if (habitsToday.length === 0) {
            return 0;
        }

        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        const countHabitsCheckedToday = Object
            .keys(habitsHistory)
            .filter(item => habitsToday.includes(item))
            .map(item => habitsHistory[item].map(item2 => format(Number(item2), 'dd-MM-yyyy')))
            .filter(item => item.includes(format(currentDate.setDate(currentDate.getDate()), 'dd-MM-yyyy')))
            .length;

        return (countHabitsCheckedToday * 100) / habitsToday.length;

    } catch (error) {
        throw new Error();
    }
}

//Habit Score
export async function getHabitScore(habit: HabitProps): Promise<HabitScoreProps> {
    try {
        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        const { currentSequence, bestSequence } = calculateSequence(habit, habitsHistory[habit.id]);

        return {
            currentSequence,
            bestSequence,
            doneCount: habitsHistory[habit.id].length ?? 0
        }

    } catch (error) {
        throw new Error(error);
    }
}

export async function getHabitHistoryCountByMonths(habit: HabitProps): Promise<number[]> {
    try {
        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        const currentDate = new Date(), y = currentDate.getFullYear(), m = currentDate.getMonth();
        const firstDay = new Date(y, m - 11, 1).getTime();

        const dates = habitsHistory[habit.id].filter(date => date > firstDay);
        const monthsCount = Array.from({ length: 12 }, () => 0);

        for (const date of dates) {
            const monthDate = new Date(date).getMonth();
            monthsCount[monthDate] = monthsCount[monthDate] + 1;
        }

        return monthsCount;
    } catch (error) {
        throw new Error(error);
    }
}