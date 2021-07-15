import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text, FlatList, ScrollView } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { format } from 'date-fns';
import { RFValue } from 'react-native-responsive-fontsize';

import { CalendarMarkedProps, HabitCalendar } from '../components/HabitCalendar';
import { ColorEnum } from '../components/ColorTrackList';
import { ScoreCard } from '../components/ScoreCard';

import { loadHabitsHistory, loadHabitsHistoryCheckedByDay } from '../libs/habitHistory.storage';
import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';
import { addDaysDate, removeDaysDate } from '../utils/date';

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
    const [isLoading, setIsLoading] = useState(true);
    const [historyDay, setHistoryDay] = useState<HabitHistoryDayProps[]>();
    const [daySelected, setDaySelected] = useState<number>();
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>({} as CalendarMarkedProps);
    const [activeHabitsCount, setActiveHabitsCount] = useState<number>(0);
    const [currentSequenceCount, setCurrentSequenceCount] = useState<number>(0);
    const [maxSequenceCount, setMaxSequenceCount] = useState<number>(0);

    const { theme } = useContext(ThemeContext);
    const { myHabits } = useContext(HabitsContext);

    useEffect(() => {
        setActiveHabitsCount(myHabits.filter(item => !item.endDate).length);
        handleHabitsHistoryDay(removeDaysDate(Date.now(), 1));
    }, []);

    async function handleHabitsHistoryDay(date: number): Promise<void> {
        const result: HabitHistoryDayProps[] = [];
        const currentDate = addDaysDate(date, 1);
        const weekDay = format(currentDate, 'EEE').toLowerCase();

        handleMarkedDate(currentDate);

        const history = await loadHabitsHistoryCheckedByDay(currentDate);
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
        setDaySelected(currentDate);
    }

    async function handleMarkedDate(dateSelected: number): Promise<void> {
        const daysChecked = await loadHabitsHistory();
        let result: CalendarMarkedProps = {};
        let currentSequence = 0;
        let maxSequence = 0;

        daysChecked.forEach((day, index) => {
            if (result[format(day, 'yyyy-MM-dd')]) {
                return;
            }

            const dateLastDay = format(removeDaysDate(day, 1), 'yyyy-MM-dd');
            const dateNextDay = format(addDaysDate(day, 1), 'yyyy-MM-dd');

            const isLastDay = daysChecked.find(item => format(item, 'yyyy-MM-dd') === dateLastDay);
            const isNextDay = daysChecked.find(item => format(item, 'yyyy-MM-dd') === dateNextDay);

            let startingDate = false;
            let endingDate = false;

            if (index === 0 || !isLastDay) {
                startingDate = true;
                maxSequence = currentSequence > maxSequence ? currentSequence : maxSequence;
                currentSequence = 0;
            }
            if (index === daysChecked.length - 1 || !isNextDay) {
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
        setIsLoading(false);
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <View style={styles(theme).header}>
                <Text style={styles(theme).title}>
                    progresso geral
                </Text>

                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    horizontal
                >
                    <ScoreCard score={String(maxSequenceCount)} legend="seq. máxima" isLoading={isLoading} />
                    <ScoreCard score={String(activeHabitsCount)} legend="hábitos ativos" isLoading={isLoading} />
                    <ScoreCard score={String(currentSequenceCount)} legend="seq. atual" isLoading={isLoading} />
                </ScrollView>
            </View>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingVertical: 20,
                    backgroundColor: themes[theme].backgroundPrimary
                }}
                showsVerticalScrollIndicator={false}
            >
                <HabitCalendar calendarMarked={calendarMarked} handleChangeSelectedDay={handleHabitsHistoryDay} />

                {historyDay?.length ?
                    <>
                        <View style={styles(theme).historyHeader}>
                            <Text style={styles(theme).subtitle}>histórico</Text>
                            <Text style={styles(theme).selectedDate}>{daySelected && format(daySelected, 'dd-MM-yyyy')}</Text>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={styles(theme).history}
                            contentContainerStyle={{
                                paddingVertical: 10
                            }}
                        >
                            {historyDay.map(habit => (
                                <View key={habit.id} style={styles(theme).historyLine}>
                                    <View style={[
                                        styles(theme).circle,
                                        {
                                            backgroundColor: habit.checked
                                                ? (habit.trackColor ?? ColorEnum.default)
                                                : themes[theme].backgroundPrimary
                                        }
                                    ]} />
                                    <Text style={styles(theme).historyLineText}>{habit.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
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
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        paddingVertical: 20
    },
    title: {
        fontSize: RFValue(18),
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        paddingBottom: 30
    },
    calendar: {
        marginHorizontal: 10,
        marginVertical: 20,
        backgroundColor: themes[theme].backgroundPrimary,
    },
    subtitle: {
        fontSize: RFValue(14),
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    },
    selectedDate: {
        fontSize: RFValue(13),
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
        paddingHorizontal: 10,
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
        fontSize: RFValue(13),
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    },
    emptyText: {
        paddingLeft: 40,
        fontSize: RFValue(13),
        fontFamily: fonts.content,
        color: themes[theme].textUnfocus
    }
})