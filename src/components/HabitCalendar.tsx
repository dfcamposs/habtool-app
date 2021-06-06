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
                textMonthFontSize: 15,
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundPrimary,
        marginTop: 10,
        marginBottom: 20
    },
})