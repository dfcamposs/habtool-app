import { format } from "date-fns";
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

export function getDates(start: Date, end: Date): string[] {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(format(new Date(dt), 'yyyy-MM-dd'));
    }
    return arr;
};

export function calculateSequence(habit: HabitProps, data: number[]): SequenceProps {
    const dates = data
        .sort()
        .map(date => format(date, 'yyyy-MM-dd'));
    const sequeceDates = getDates(
        new Date(data[0]),
        addDaysDate(Date.now(), 1)
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