import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text, FlatList, ScrollView } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { format } from 'date-fns';

import { CalendarMarkedProps, HabitCalendar } from '../components/HabitCalendar';
import { ColorEnum } from '../components/ColorTrackList';

import { loadHabitsHistory, loadHabitsHistoryCheckedByDay } from '../libs/storage';
import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

import '../config/calendar';

interface HabitHistoryDayProps {
    id: string;
    name: string;
    checked: boolean;
    trackColor?: ColorEnum
}

export function Progress() {
    const { theme } = useContext(ThemeContext);
    const initialCalendarMarked = {
        [format(new Date(), 'yyyy-MM-dd')]: {
            selected: true,
            color: themes[theme].blue,
            textColor: themes[theme].textSecundary
        }
    }
    const { myHabits } = useContext(HabitsContext);
    const [historyDay, setHistoryDay] = useState<HabitHistoryDayProps[]>();
    const [daySelected, setDaySelected] = useState<number>();
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>(initialCalendarMarked);
    const [activeHabitsCount, setActiveHabitsCount] = useState<number>(0);
    const [currentSequenceCount, setCurrentSequenceCount] = useState<number>(0);
    const [maxSequenceCount, setMaxSequenceCount] = useState<number>(0);


    useEffect(() => {
        const currentDate = new Date();
        const dateFormatted = currentDate.setDate(currentDate.getDate() - 1);

        setActiveHabitsCount(myHabits.filter(item => !item.endDate).length);
        handleHabitsHistoryDay(dateFormatted);
    }, []);

    async function handleHabitsHistoryDay(date: number): Promise<void> {
        const result: HabitHistoryDayProps[] = [];
        const newDate = new Date(date);
        const dateFormatted = newDate.setDate(newDate.getDate() + 1);
        const weekDay = format(dateFormatted, 'EEE').toLowerCase();

        handleMarkedDate(dateFormatted);

        const history = await loadHabitsHistoryCheckedByDay(dateFormatted);
        myHabits.forEach(habit => {
            if (habit.frequency[weekDay]) {
                result.push({
                    id: habit.id,
                    name: habit.name,
                    checked: !!history.find(item => item.id === habit.id),
                    trackColor: habit.trackColor
                })
            }
        });

        setHistoryDay(result);
        setDaySelected(dateFormatted);
    }

    async function handleMarkedDate(dateSelected: number): Promise<void> {
        const history = await loadHabitsHistory();
        const daysChecked: number[] = [];
        let result: CalendarMarkedProps = {};
        let currentSequence = 0;
        let maxSequence = 0;

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
            const newDateNextDayFormatted = format(newDateNextDay.setDate(newDateNextDay.getDate() + 1), 'yyyy-MM-dd');

            const lastDay = daysChecked.find(item => format(item, 'yyyy-MM-dd') === newDateLastDayFormatted);
            const nextDay = daysChecked.find(item => format(item, 'yyyy-MM-dd') === newDateNextDayFormatted);

            let startingDate = false;
            let endingDate = false;

            if (index === 0 || !lastDay) {
                startingDate = true;
                maxSequence = currentSequence > maxSequence ? currentSequence : maxSequence;
                currentSequence = 0;
            }
            if (index === daysChecked.length - 1 || !nextDay) {
                endingDate = true;
            }

            currentSequence++;
            maxSequence = maxSequence < currentSequence ? currentSequence : maxSequence;
            result = {
                ...result,
                [format(day, 'yyyy-MM-dd')]: {
                    startingDay: startingDate,
                    endingDay: endingDate,
                    color: format(day, 'yyyy-MM-dd') === format(dateSelected, 'yyyy-MM-dd')
                        ? themes[theme].blueDark
                        : themes[theme].blue,
                    textColor: themes[theme].textSecundary
                }
            }
        });

        if (dateSelected && !result[format(dateSelected, 'yyyy-MM-dd')]) {
            result = {
                ...result,
                [format(dateSelected, 'yyyy-MM-dd')]: {
                    startingDay: true,
                    endingDay: true,
                    color: themes[theme].backgroundSecundary,
                    textColor: themes[theme].textPrimary
                }
            }
        }

        setCalendarMarked(result);
        setCurrentSequenceCount(currentSequence);
        setMaxSequenceCount(maxSequence);
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <View style={styles(theme).header}>
                <Text style={styles(theme).title}>
                    progresso geral
                </Text>

                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View style={styles(theme).card}>
                        <Text style={styles(theme).score}>{maxSequenceCount}</Text>
                        <Text style={styles(theme).legend}>seq. máxima (dias)</Text>
                    </View>
                    <View style={styles(theme).card}>
                        <Text style={styles(theme).score}>{activeHabitsCount}</Text>
                        <Text style={styles(theme).legend}>hábitos ativos</Text>
                    </View>
                    <View style={styles(theme).card}>
                        <Text style={styles(theme).score}>{currentSequenceCount}</Text>
                        <Text style={styles(theme).legend}>seq. atual (dias)</Text>
                    </View>
                </ScrollView>
            </View>
            <ScrollView style={styles(theme).content} showsVerticalScrollIndicator={false}>
                <HabitCalendar calendarMarked={calendarMarked} handleChangeSelectedDay={handleHabitsHistoryDay} />

                {historyDay?.length ?
                    <>
                        <View style={styles(theme).historyHeader}>
                            <Text style={styles(theme).subtitle}>histórico</Text>
                            <Text style={styles(theme).selectedDate}>{daySelected && format(daySelected, 'dd-MM-yyyy')}</Text>
                        </View>
                        <View style={styles(theme).history}>
                            <FlatList
                                data={historyDay}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item: habit }) => (
                                    <View style={styles(theme).historyLine}>
                                        <View style={[styles(theme).circle, { backgroundColor: habit.checked ? (habit.trackColor ?? ColorEnum.default) : themes[theme].backgroundPrimary }]} />
                                        <Text style={styles(theme).historyLineText}>{habit.name}</Text>
                                    </View>
                                )}
                                showsVerticalScrollIndicator={false}

                            />
                        </View>
                    </>
                    : <Text style={styles(theme).emptyText}>nenhum hábito nesta data.</Text>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: themes[theme].backgroundSecundary,
    },
    header: {
        height: Platform.OS === 'ios' ? 170 : 180,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        paddingVertical: 20
    },
    content: {
        flexGrow: 1,
        backgroundColor: themes[theme].backgroundPrimary,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        paddingBottom: 30
    },
    card: {
        width: 120,
        height: 70,
        backgroundColor: themes[theme].backgroundPrimary,
        borderRadius: 10,
        marginHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    score: {
        fontSize: 24,
        color: themes[theme].textPrimary,
        fontFamily: fonts.content,
        alignSelf: 'center',
        lineHeight: 30
    },
    legend: {
        fontSize: 10,
        color: themes[theme].textUnfocus,
        fontFamily: fonts.legend,
        alignSelf: 'center'
    },
    calendar: {
        marginHorizontal: 10,
        marginVertical: 20,
        backgroundColor: themes[theme].backgroundPrimary,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    },
    selectedDate: {
        fontSize: 15,
        fontFamily: fonts.content,
        color: themes[theme].textUnfocus,
        paddingLeft: 10
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginHorizontal: 25,
        paddingVertical: 10
    },
    history: {
        flex: 1,
        backgroundColor: themes[theme].backgroundSecundary,
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 10,
        height: 150,
        marginBottom: 20,
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
        backgroundColor: themes[theme].gray,
        marginHorizontal: 10
    },
    historyLineText: {
        flex: 1,
        fontSize: 15,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    },
    emptyText: {
        paddingLeft: 40,
        fontSize: 15,
        fontFamily: fonts.content,
        color: themes[theme].textUnfocus
    }
})