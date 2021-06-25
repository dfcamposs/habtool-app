import { format } from "date-fns";
import { HabitProps } from "../libs/storage";

interface SequenceProps {
    currentSequence: number;
    bestSequence: number;
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
        new Date(Date.now())
    );

    let bestSequence = 0;
    let currentSequence = 0;
    const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    for (const date of sequeceDates) {
        const [year, month, day] = date.split("-");
        const weekDay = weekDays[new Date(Number(year), Number(month) - 1, Number(day)).getDay()];

        if (dates.includes(date) || (currentSequence > 0 && (weekDay && !habit.frequency[weekDay]))) {
            currentSequence++;
        } else {
            currentSequence = 0;
        }

        bestSequence = (currentSequence > bestSequence) ? currentSequence : bestSequence
    }

    return { currentSequence, bestSequence }
}