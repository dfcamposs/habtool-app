import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import '../config/calendar';

export interface CalendarMarkedProps {
    [date: string]: {
        startingDay?: boolean;
        endingDay?: boolean;
        selected?: boolean;
        color?: string;
        textColor?: string;
    }
}

interface HabitCalendar {
    calendarMarked: CalendarMarkedProps,
    handleChangeSelectedDay: (date: number) => void;
}

export function HabitCalendar({ calendarMarked, handleChangeSelectedDay }: HabitCalendar) {
    const theme = "dark";

    return (
        <Calendar
            markedDates={calendarMarked}
            markingType={'period'}
            onDayPress={(date) => handleChangeSelectedDay(date.timestamp)}
            style={styles(theme).container}
            theme={{
                calendarBackground: colors[theme].backgroundPrimary,
                arrowColor: colors[theme].textPrimary,
                todayTextColor: colors[theme].blue,
                dayTextColor: colors[theme].textPrimary,
                dotColor: colors[theme].blue,
                monthTextColor: colors[theme].textPrimary,
                indicatorColor: colors[theme].textPrimary,
                textDisabledColor: colors[theme].textUnfocus,
                textDayFontFamily: fonts.content,
                textMonthFontFamily: fonts.content,
                textDayHeaderFontFamily: fonts.content,
                textDayFontSize: 12,
                textDayHeaderFontSize: 12,
                textMonthFontSize: 15,
            }}
        />
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        backgroundColor: colors[theme].backgroundPrimary,
        marginTop: 10,
        marginBottom: 20
    },
})