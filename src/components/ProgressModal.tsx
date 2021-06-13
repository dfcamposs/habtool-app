import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, ModalProps, TouchableOpacity, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { format, isAfter, isBefore } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { LightenDarkenColor } from '../utils/colors';
import { CalendarMarkedProps, HabitCalendar } from './HabitCalendar';

import { loadHabitHistoryByHabitId, updateHabitHistory, HabitProps } from '../libs/storage';
import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import { ColorEnum } from './ColorTrackList';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface ProgressModalProps extends ModalProps {
    data: HabitProps,
    visible: boolean;
    closeModal: () => void;
}

export function ProgressModal({ data: habit, visible = false, closeModal, ...rest }: ProgressModalProps) {
    const { theme } = useContext(ThemeContext);
    const { isPro } = useContext(UserContext);
    const principalColor = isPro ? (habit.trackColor ? habit.trackColor : ColorEnum.default) : themes[theme].blue;

    const initialCalendarMarked = {
        [format(new Date(), 'yyyy-MM-dd')]: {
            selected: true,
            color: principalColor,
            textColor: themes[theme].textSecundary
        }
    }
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>(initialCalendarMarked);

    const { refreshHistoryCalendar } = useContext(HabitsContext);

    async function handleChangeSelectedDay(date: number) {

        const dateSelected = new Date(date);
        const dateFormatted = dateSelected.setDate(dateSelected.getDate() + 1);
        const weekDay = format(dateFormatted, 'E').toLocaleLowerCase();

        if ((isBefore(dateSelected, Date.now()) ||
            format(dateSelected, 'yyyy-MM-dd') === format(Date.now(), 'yyyy-MM-dd'))
            && (!habit.endDate || isAfter(habit.endDate, Date.now()))
        ) {
            Haptics.impactAsync();
            if (habit.frequency[weekDay]) {
                Alert.alert('alterar histórico', `deseja alterar este dia no histórico?`, [
                    {
                        text: 'não',
                        style: 'cancel'
                    },
                    {
                        text: 'sim',
                        onPress: async () => {
                            try {
                                await updateHabitHistory(habit.id, dateFormatted);
                                await handleMarkedDate(dateFormatted);
                            } catch (error) {
                                Alert.alert(
                                    'algo deu errado',
                                    'não foi possível incluir este dia no histórico do hábito'
                                );
                            }
                        }
                    }
                ]);
            } else {
                Alert.alert(
                    'dia não disponível',
                    'atualize as configurações do hábito para alterar o histórico'
                );
            }
        }

        await handleMarkedDate(dateFormatted);
    }

    async function handleMarkedDate(dateSelected: number): Promise<void> {
        const history = await loadHabitHistoryByHabitId(habit.id);
        let result: CalendarMarkedProps = {};

        if (dateSelected) {
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

        history.sort().forEach((day, index) => {
            const newDateLastDay = new Date(day);
            const newDateLastDayFormatted = format(newDateLastDay.setDate(newDateLastDay.getDate() - 1), 'yyyy-MM-dd');

            const newDateNextDay = new Date(day);
            const newDateNextDayFormatted = format(newDateNextDay.setDate(newDateNextDay.getDate() + 1), 'yyyy-MM-dd');

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
                        ? LightenDarkenColor(principalColor, 20)
                        : principalColor,
                    textColor: themes[theme].textSecundary
                }
            }
        });


        setCalendarMarked(result);
    }

    useEffect(() => {
        handleMarkedDate(Date.now());
    }, [refreshHistoryCalendar]);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            statusBarTranslucent={true}
        >
            <View style={styles(theme).container}>
                <Text style={styles(theme).modalTitle}>{habit.name}</Text>

                <View style={styles(theme).calendar}>
                    <Text style={styles(theme).subtitle}>histórico</Text>
                    <HabitCalendar calendarMarked={calendarMarked} handleChangeSelectedDay={handleChangeSelectedDay} />
                    {habit.endDate && isBefore(habit.endDate, Date.now()) &&
                        <Text style={styles(theme).disabledText}>este hábito está desabilitado.</Text>
                    }
                </View>

                <TouchableOpacity style={styles(theme).button} onPress={closeModal} activeOpacity={0.5}>
                    <Text style={styles(theme).textButton}>voltar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: getStatusBarHeight(),
        paddingVertical: 23,
        paddingHorizontal: 10,
        backgroundColor: themes[theme].backgroundPrimary
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        paddingVertical: 40
    },
    calendar: {
        flex: 1,
        width: '100%',
        backgroundColor: themes[theme].backgroundPrimary
    },
    subtitle: {
        fontSize: 18,
        fontFamily: fonts.subtitle,
        color: themes[theme].textUnfocus,
        paddingLeft: 20,
    },
    disabledText: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: themes[theme].textUnfocus,
        paddingTop: 20,
        paddingLeft: 20,
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    textButton: {
        fontSize: 16,
        fontFamily: fonts.contentBold,
        color: themes[theme].textPrimary
    },
})
