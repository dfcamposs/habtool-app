import { format } from "date-fns";

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