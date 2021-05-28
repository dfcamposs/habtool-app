import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text, FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Calendar, DateObject } from 'react-native-calendars';
import { format } from 'date-fns';

import { loadHabitsHistory, loadHabitsHistoryCheckedByDay } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import '../libs/calendarConfig';

interface HabitHistoryDayProps {
    id: string;
    name: string;
    checked: boolean;
}

interface CalendarMarkedProps {
    [date: string]: {
        startingDay?: boolean;
        endingDay?: boolean;
        selected?: boolean;
        color?: string;
        textColor?: string;
    }
}

export function Progress() {
    const initialCalendarMarked = {
        [format(new Date(), 'yyyy-MM-dd')]: {
            selected: true,
            color: colors.blue,
            textColor: colors.textLight
        }
    }
    const { myHabits } = useContext(HabitsContext);
    const [historyDay, setHistoryDay] = useState<HabitHistoryDayProps[]>();
    const [daySelected, setDaySelected] = useState<number>();
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>(initialCalendarMarked);
    const [activeHabitsCount, setActiveHabitsCount] = useState<number>(0);
    const [currentSequenceCount, setCurrentSequenceCount] = useState<number>(0);

    useEffect(() => {
        const currentDate = new Date();
        const dateFormatted = currentDate.setDate(currentDate.getDate() - 1);

        setActiveHabitsCount(myHabits.filter(item => !item.endDate).length);
        handleHabitsHistoryDay({ timestamp: dateFormatted } as DateObject);
    }, [myHabits]);


    async function handleHabitsHistoryDay(date: DateObject): Promise<void> {
        const result: HabitHistoryDayProps[] = [];
        const newDate = new Date(date.timestamp);
        const dateFormatted = newDate.setDate(newDate.getDate() + 1);
        const weekDay = format(dateFormatted, 'EEE').toLowerCase();

        handleMarkedDate(dateFormatted);

        const history = await loadHabitsHistoryCheckedByDay(dateFormatted);
        myHabits.forEach(habit => {
            if (habit.frequency[weekDay]) {
                result.push({
                    id: habit.id,
                    name: habit.name,
                    checked: !!history.find(item => item.id === habit.id)
                })
            }
        });

        setHistoryDay(result);
        setDaySelected(dateFormatted);
    }

    async function handleMarkedDate(dateSelected: number): Promise<void> {
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
                    color: format(day, 'yyyy-MM-dd') === format(dateSelected, 'yyyy-MM-dd')
                        ? colors.blueDark
                        : colors.blue,
                    textColor: colors.textLight
                }
            }
        });

        if (dateSelected && !result[format(dateSelected, 'yyyy-MM-dd')]) {
            result = {
                ...result,
                [format(dateSelected, 'yyyy-MM-dd')]: {
                    startingDay: true,
                    endingDay: true,
                    color: colors.grayLight,
                    textColor: colors.textDark
                }
            }
        }

        setCalendarMarked(result);
        setCurrentSequenceCount(currentSequence);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    progresso geral
                </Text>

                <View style={styles.cards}>
                    <View style={styles.card}>
                        <Text style={styles.score}>{activeHabitsCount}</Text>
                        <Text style={styles.legend}>hábitos ativos</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.score}>{currentSequenceCount}</Text>
                        <Text style={styles.legend}>sequencia atual (dias)</Text>
                    </View>
                </View>
            </View>
            <View style={styles.content}>
                <Calendar
                    markedDates={calendarMarked}
                    markingType={'period'}
                    onDayPress={(date) => handleHabitsHistoryDay(date)}
                    style={styles.calendar}
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

                {historyDay?.length ?
                    <>
                        <View style={styles.historyHeader}>
                            <Text style={styles.subtitle}>histórico</Text>
                            <Text style={styles.selectedDate}>{daySelected && format(daySelected, 'dd-MM-yyyy')}</Text>
                        </View>
                        <FlatList
                            data={historyDay}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item: habit }) => (
                                <View style={styles.historyLine}>
                                    <View style={[styles.circle, { backgroundColor: habit.checked ? colors.green : colors.white }]} />
                                    <Text style={styles.historyLineText}>{habit.name}</Text>
                                </View>
                            )}
                            showsVerticalScrollIndicator={false}
                            style={styles.history}
                        />
                    </>
                    : <Text style={styles.emptyText}>nenhum hábito nesta data.</Text>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.grayLight,
    },
    header: {
        height: 170,
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        paddingVertical: 20
    },
    content: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: 20
    },
    title: {
        fontSize: 20,
        fontFamily: fonts.title,
        color: colors.textDark,
        paddingBottom: 25
    },
    cards: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    card: {
        width: 160,
        height: 70,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    score: {
        fontSize: 30,
        color: colors.textDark,
        fontFamily: fonts.content
    },
    legend: {
        fontSize: 12,
        color: colors.textDark,
        fontFamily: fonts.legend
    },
    calendar: {
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: colors.background,
    },
    subtitle: {
        fontSize: 20,
        fontFamily: fonts.content,
        color: colors.textDark
    },
    selectedDate: {
        fontSize: 14,
        fontFamily: fonts.content,
        color: colors.textUnfocus,
        paddingLeft: 10
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginHorizontal: 35,
        paddingBottom: 10,
    },
    history: {
        flex: 1,
        backgroundColor: colors.grayLight,
        marginHorizontal: 30,
        borderRadius: 10,
        padding: 10,
    },
    historyLine: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: colors.grayDark,
        marginHorizontal: 10
    },
    historyLineText: {
        flex: 1,
        fontSize: 16,
        fontFamily: fonts.content,
        color: colors.textDark
    },
    emptyText: {
        paddingLeft: 40,
        fontSize: 16,
        fontFamily: fonts.content,
        color: colors.textUnfocus
    }
})