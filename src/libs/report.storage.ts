import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isAfter } from "date-fns";
import { calculateSequence } from "../utils/date";

import { StorageHistoryHabitProps, HabitProps, StorageHabitProps } from "./schema.storage";

export interface HabitScoreProps {
    currentSequence: number;
    bestSequence: number;
    doneCount: number;
    amountPercentage: number;
}

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

export async function getHabitScore(habit: HabitProps): Promise<HabitScoreProps> {
    try {
        const dataHistory = await AsyncStorage.getItem('@habtool:habitsHistory');
        const habitsHistory = dataHistory ? (JSON.parse(dataHistory) as StorageHistoryHabitProps) : {};

        const { currentSequence, bestSequence, amountPercentage } = calculateSequence(habit, habitsHistory[habit.id]);

        return {
            currentSequence,
            bestSequence,
            amountPercentage,
            doneCount: habitsHistory[habit.id].length ?? 0,
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