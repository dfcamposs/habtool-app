import { addDays, format, subDays } from "date-fns";
import { eachDayOfInterval } from "date-fns/esm";

import { HabitProps } from "../libs/schema.storage";

interface SequenceProps {
    currentSequence: number;
    bestSequence: number;
    amountPercentage: number;
}

export function addDaysDate(date: number, days: number): number {
    return addDays(date, days).getTime();
}

export function removeDaysDate(date: number, days: number): number {
    return subDays(date, days).getTime();
}

export function calculateSequence(habit: HabitProps, data: number[]): SequenceProps {
    const dates = data
        .sort()
        .map(date => format(date, 'yyyy-MM-dd'));

    const sequeceDates = eachDayOfInterval({
        start: new Date(dates[0]),
        end: addDaysDate(new Date(dates[dates.length - 1]).getTime(), 1),
    }).map(date => format(date, 'yyyy-MM-dd'));

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