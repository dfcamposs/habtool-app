import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
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
    color?: string;
}

export function HabitCalendar({ calendarMarked, handleChangeSelectedDay, color }: HabitCalendar) {
    const { theme } = useContext(ThemeContext);

    return (
        <Calendar
            markedDates={calendarMarked}
            markingType={'period'}
            onDayPress={(date) => handleChangeSelectedDay(date.timestamp)}
            style={styles(theme).container}
            theme={{
                calendarBackground: themes[theme].backgroundPrimary,
                arrowColor: themes[theme].textPrimary,
                todayTextColor: color ?? themes[theme].blue,
                dayTextColor: themes[theme].textPrimary,
                dotColor: color ?? themes[theme].blue,
                monthTextColor: themes[theme].textPrimary,
                indicatorColor: themes[theme].textPrimary,
                textDisabledColor: themes[theme].textUnfocus,
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
        backgroundColor: themes[theme].backgroundPrimary,
        marginTop: 10,
        marginBottom: 20
    },
})