import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text, Alert, FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { Calendar, DateObject } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { loadHabitsHistoryCheckedByDay } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { HabitsContext } from '../context/habits';

LocaleConfig.locales['br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dec'],
    dayNames: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    today: 'Hoje'
};

LocaleConfig.defaultLocale = 'br';

interface HabitHistoryDayProps {
    id: string;
    name: string;
    checked: boolean;
}

export function Progress() {
    const { myHabits } = useContext(HabitsContext);
    const [historyDay, setHistoryDay] = useState<HabitHistoryDayProps[]>();

    useEffect(() => {

    }, []);

    async function handleHabitsHistoryDay(date: DateObject): Promise<HabitHistoryDayProps[]> {
        const result: HabitHistoryDayProps[] = [];
        const weekDay = format(zonedTimeToUtc(date.timestamp, 'America/Sao_Paulo'), 'EEE').toLowerCase();
        // const history = await loadHabitsHistoryCheckedByDay(day);

        // myHabits.forEach(habit => {
        //     if (habit.frequency[weekDay]) {
        //         result.push({
        //             id: habit.id,
        //             name: habit.name,
        //             checked: !!history.find(item => item.id === habit.id)
        //         })
        //     }
        // })
        console.log(weekDay, zonedTimeToUtc(date.timestamp, 'America/Sao_Paulo'));
        return result;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    progresso geral
                </Text>

                <View style={styles.cards}>
                    <View style={styles.card}>
                        <Text style={styles.score}>10</Text>
                        <Text style={styles.legend}>hábitos ativos</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.score}>4.5</Text>
                        <Text style={styles.legend}>pontuação geral</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.score}>20</Text>
                        <Text style={styles.legend}>dias sem falhas</Text>
                    </View>
                </View>
            </View>
            <View style={styles.content}>
                <Calendar
                    markedDates={{
                        '2021-05-12': { startingDay: true, color: colors.blue, textColor: colors.textLight },
                        '2021-05-13': { selected: true, color: colors.blue, textColor: colors.textLight },
                        '2021-05-14': { selected: true, color: colors.blue, textColor: colors.textLight },
                        '2021-05-15': { selected: true, color: colors.blue, textColor: colors.textLight },
                        '2021-05-16': { selected: true, color: colors.blue, textColor: colors.textLight },
                        '2021-05-17': { selected: true, endingDay: true, color: colors.blue, textColor: colors.textLight },
                        '2021-05-04': { disabled: true, startingDay: true, color: colors.blue, endingDay: true, textColor: colors.textLight }
                    }}
                    markingType={'period'}
                    onDayPress={(date) => handleHabitsHistoryDay(date)}
                    style={styles.calendar}
                    theme={{
                        calendarBackground: colors.background,
                        arrowColor: colors.textDark,
                        todayTextColor: colors.blue,
                        dayTextColor: colors.textDark,
                        dotColor: colors.blue,
                        selectedDotColor: colors.blue,
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

                <Text style={styles.subtitle}>Histórico</Text>
                <FlatList
                    data={[{ id: 1 }]}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <>
                            <View style={styles.historyLine}>
                                <View style={[styles.circle, { backgroundColor: colors.green }]} />
                                <Text style={styles.historyLineText}>ler um livro</Text>
                            </View>
                            <View style={styles.historyLine}>
                                <View style={[styles.circle, { backgroundColor: colors.white }]} />
                                <Text style={styles.historyLineText}>fazer exercício fisico</Text>
                            </View>
                            <View style={styles.historyLine}>
                                <View style={[styles.circle, { backgroundColor: colors.white }]} />
                                <Text style={styles.historyLineText}>meditar</Text>
                            </View>
                            <View style={styles.historyLine}>
                                <View style={[styles.circle, { backgroundColor: colors.green }]} />
                                <Text style={styles.historyLineText}>cozinhar</Text>
                            </View>
                        </>
                    )}
                    showsVerticalScrollIndicator={false}
                    style={styles.history}
                />
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
        fontSize: 24,
        fontFamily: fonts.title,
        color: colors.textDark,
        paddingBottom: 25
    },
    cards: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    card: {
        width: 100,
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
        fontSize: 11,
        color: colors.textDark,
        fontFamily: fonts.legend
    },
    calendar: {
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: colors.background,
    },
    subtitle: {
        marginHorizontal: 30,
        paddingBottom: 10,
        fontSize: 20,
        fontFamily: fonts.content,
        color: colors.textDark
    },
    history: {
        flex: 1,
        backgroundColor: colors.grayLight,
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 10,
    },
    historyLine: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    circle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: colors.grayDark,
        marginHorizontal: 10
    },
    historyLineText: {
        flex: 1,
        fontSize: 18,
        fontFamily: fonts.content,
        color: colors.textDark
    }
})