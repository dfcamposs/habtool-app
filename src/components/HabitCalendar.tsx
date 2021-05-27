import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';

import { loadHabitsHistory } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

LocaleConfig.locales['br'] = {
    monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dec'],
    dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
    today: 'hoje'
};

LocaleConfig.defaultLocale = 'br';

interface CalendarMarkedProps {
    [date: string]: {
        startingDay?: boolean;
        endingDay?: boolean;
        selected?: boolean;
        color?: string;
        textColor?: string;
    }
}

export function HabitCalendar() {
    const initialCalendarMarked = {
        [format(new Date(), 'yyyy-MM-dd')]: {
            selected: true,
            color: colors.blue,
            textColor: colors.textLight
        }
    }
    const [daySelected, setDaySelected] = useState<number>();
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>(initialCalendarMarked);

    const { myHabits } = useContext(HabitsContext);

    useEffect(() => {
        handleMarkDaySelected(Date.now())
    }, [myHabits]);

    useEffect(() => {
        handleMarkedDate();
    }, [daySelected])

    function handleMarkDaySelected(date: number) {
        const currentDate = new Date(date);
        const dateFormatted = currentDate.setDate(currentDate.getDate() + 1);
        setDaySelected(dateFormatted);
    }

    async function handleMarkedDate(): Promise<void> {
        const history = await loadHabitsHistory();
        const daysChecked: number[] = [];
        let result: any = {};
        let currentSequence = 0

        history.forEach(item => {
            daysChecked.push(...item.history);
        });

        daysChecked.sort().forEach((day, index) => {
            if (result[format(day, 'yyyy-MM-dd')]) {
                return;
            }
            const newDateLastDay = new Date(day);
            const newDateLastDayFormatted = format(newDateLastDay.setDate(newDateLastDay.getDate() - 1), 'yyyy-MM-dd');

            const newDateNextDay = new Date(day);
            const newDateNextDayFormatted = format(newDateLastDay.setDate(newDateNextDay.getDate() + 1), 'yyyy-MM-dd');

            const lastDay = daysChecked.find(item => format(item, 'yyyy-MM-dd') === newDateLastDayFormatted);
            const nextDay = daysChecked.find(item => format(item, 'yyyy-MM-dd') === newDateNextDayFormatted);

            let startingDate = false;
            let endingDate = false;

            if (index === 0 || !lastDay) {
                startingDate = true;
                currentSequence = 0;
            }
            if (index === daysChecked.length - 1 || !nextDay) {
                endingDate = true;
            }

            currentSequence++;
            result = {
                ...result,
                [format(day, 'yyyy-MM-dd')]: {
                    startingDay: startingDate,
                    endingDay: endingDate,
                    color: colors.blue,
                    textColor: colors.textLight
                }
            }
        });

        if (daySelected) {
            result = {
                ...result,
                [format(daySelected, 'yyyy-MM-dd')]: {
                    startingDay: true,
                    endingDay: true,
                    color: colors.grayLight,
                    textColor: colors.textDark
                }
            }
        }

        setCalendarMarked(result);
    }
    return (
        <Calendar
            markedDates={calendarMarked}
            markingType={'period'}
            onDayPress={(date) => handleMarkDaySelected(date.timestamp)}
            style={styles.container}
            theme={{
                calendarBackground: colors.background,
                arrowColor: colors.textDark,
                todayTextColor: colors.blue,
                dayTextColor: colors.textDark,
                dotColor: colors.blue,
                monthTextColor: colors.textDark,
                indicatorColor: colors.textDark,
                textDisabledColor: colors.textUnfocus,
                textDayFontFamily: fonts.content,
                textMonthFontFamily: fonts.content,
                textDayHeaderFontFamily: fonts.content,
                textDayFontSize: 12,
                textDayHeaderFontSize: 12,
                textMonthFontSize: 16,
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: colors.background,
    },
})