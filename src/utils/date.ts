import { addDays, format } from "date-fns";
import { HabitProps } from "../libs/storage";

interface SequenceProps {
    currentSequence: number;
    bestSequence: number;
    amountPercentage: number;
}

export function addDaysDate(date: number, days: number): Date {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export function removeDaysDate(date: number, days: number): Date {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
}

export function getDates(start: number, end: number): string[] {
    const result: string[] = [];

    for (let i = start; i <= end; i = addDays(i, 1).getTime()) {
        result.push(format(new Date(i), 'yyyy-MM-dd'));
    }

    return result;
};

export function calculateSequence(habit: HabitProps, data: number[]): SequenceProps {
    const dates = data
        .sort()
        .map(date => format(date, 'yyyy-MM-dd'));
    const sequeceDates = getDates(
        new Date(dates[0]).getTime(),
        addDays(new Date(dates[dates.length - 1]), 1).getTime(),
    );

    let bestSequence = 0;
    let currentSequence = 0;
    let amountPercentage = 0;
    const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    for (const date of sequeceDates) {
        const [year, month, day] = date.split("-");
        const weekDay = weekDays[new Date(Number(year), Number(month) - 1, Number(day)).getDay()];

        if ((currentSequence > 0 && (weekDay && !habit.frequency[weekDay]))) {
            continue;
        }

        if (dates.includes(date)) {
            currentSequence++;
            amountPercentage++;
        } else {
            currentSequence = 0;
            amountPercentage = amountPercentage > 0 ? amountPercentage-- : 0;
        }

        bestSequence = (currentSequence > bestSequence) ? currentSequence : bestSequence;
    }

    return {
        currentSequence,
        bestSequence,
        amountPercentage: Math.round((amountPercentage * 100) / 66)
    }
}