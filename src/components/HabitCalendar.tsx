import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, isBefore } from 'date-fns';

import { loadHabitHistoryByHabitId, updateHabitHistory } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import '../libs/calendarConfig';

interface CalendarMarkedProps {
    [date: string]: {
        startingDay?: boolean;
        endingDay?: boolean;
        selected?: boolean;
        color?: string;
        textColor?: string;
    }
}

interface HabitCalendar {
    habitId: string;
}

export function HabitCalendar({ habitId }: HabitCalendar) {
    const initialCalendarMarked = {
        [format(new Date(), 'yyyy-MM-dd')]: {
            selected: true,
            color: colors.blue,
            textColor: colors.textSecundary
        }
    }
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>(initialCalendarMarked);

    useEffect(() => {
        handleMarkedDate(Date.now());
    }, []);

    async function handleChangeSelectedDay(date: number) {
        const dateSelected = new Date(date);
        const dateFormatted = dateSelected.setDate(dateSelected.getDate() + 1);

        if (isBefore(dateSelected, Date.now()) ||
            format(dateSelected, 'yyyy-MM-dd') === format(Date.now(), 'yyyy-MM-dd')
        ) {
            Alert.alert('Alterar Histórico', `Deseja alterar este dia no histórico?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await updateHabitHistory(habitId, dateFormatted);
                            await handleMarkedDate(dateFormatted);
                        } catch (error) {
                            Alert.alert('Não foi possível incluir no histórico');
                        }
                    }
                }
            ]);
        }

        await handleMarkedDate(dateFormatted);
    }

    async function handleMarkedDate(dateSelected: number): Promise<void> {
        const history = await loadHabitHistoryByHabitId(habitId);
        let result: CalendarMarkedProps = {};

        if (dateSelected) {
            result = {
                ...result,
                [format(dateSelected, 'yyyy-MM-dd')]: {
                    startingDay: true,
                    endingDay: true,
                    color: colors.backgroundSecundary,
                    textColor: colors.textPrimary
                }
            }
        }

        history.sort().forEach((day, index) => {
            const newDateLastDay = new Date(day);
            const newDateLastDayFormatted = format(newDateLastDay.setDate(newDateLastDay.getDate() - 1), 'yyyy-MM-dd');

            const newDateNextDay = new Date(day);
            const newDateNextDayFormatted = format(newDateLastDay.setDate(newDateNextDay.getDate() + 1), 'yyyy-MM-dd');

            const lastDay = history.find(item => format(item, 'yyyy-MM-dd') === newDateLastDayFormatted);
            const nextDay = history.find(item => format(item, 'yyyy-MM-dd') === newDateNextDayFormatted);

            let startingDate = false;
            let endingDate = false;

            if (index === 0 || !lastDay) {
                startingDate = true;
            }
            if (index === history.length - 1 || !nextDay) {
                endingDate = true;
            }

            result = {
                ...result,
                [format(day, 'yyyy-MM-dd')]: {
                    startingDay: startingDate,
                    endingDay: endingDate,
                    color: dateSelected
                        && format(day, 'yyyy-MM-dd') === format(dateSelected, 'yyyy-MM-dd')
                        ? colors.blueDark
                        : colors.blue,
                    textColor: colors.textSecundary
                }
            }
        });


        setCalendarMarked(result);
    }
    return (
        <Calendar
            markedDates={calendarMarked}
            markingType={'period'}
            onDayPress={(date) => handleChangeSelectedDay(date.timestamp)}
            style={styles.container}
            theme={{
                calendarBackground: colors.backgroundPrimary,
                arrowColor: colors.textPrimary,
                todayTextColor: colors.blue,
                dayTextColor: colors.textPrimary,
                dotColor: colors.blue,
                monthTextColor: colors.textPrimary,
                indicatorColor: colors.textPrimary,
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
        backgroundColor: colors.backgroundPrimary,
    },
})