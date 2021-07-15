import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    ModalProps,
    TouchableOpacity,
    Alert,
    Dimensions,
    ScrollView
} from 'react-native';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { format, isAfter, isBefore } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import { LightenDarkenColor } from '../utils/colors';
import { CalendarMarkedProps, HabitCalendar } from './HabitCalendar';
import { ColorEnum } from './ColorTrackList';

import { HabitProps } from '../libs/schema.storage';
import {
    getHabitScore,
    HabitScoreProps,
    getHabitHistoryCountByMonths
} from '../libs/report.storage';
import {
    loadHabitHistoryByHabitId,
    updateHabitHistory,
} from '../libs/habitHistory.storage';

import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import themes from '../styles/themes';
import fonts from '../styles/fonts';
import { addDaysDate, removeDaysDate } from '../utils/date';
import { ScoreCard } from './ScoreCard';

interface ProgressModalProps extends ModalProps {
    data: HabitProps,
    visible: boolean;
    closeModal: () => void;
}

export function ProgressModal({ data: habit, visible = false, closeModal, ...rest }: ProgressModalProps) {
    const [score, setScore] = useState<HabitScoreProps>({
        currentSequence: 0,
        bestSequence: 0,
        amountPercentage: 0,
        doneCount: 0,
    });
    const [progressByMonth, setProgressByMonth] = useState(Array.from({ length: 12 }, () => 0));
    const [calendarMarked, setCalendarMarked] = useState<CalendarMarkedProps>({} as CalendarMarkedProps);

    const { theme } = useContext(ThemeContext);
    const { isPro } = useContext(UserContext);
    const { refreshHistoryCalendar } = useContext(HabitsContext);
    const principalColor =
        isPro
            ? (habit.trackColor
                ? habit.trackColor
                : ColorEnum.default
            )
            : themes[theme].blue;

    async function handleChangeSelectedDay(date: number) {
        const dateSelected = addDaysDate(date, 1);
        const weekDay = format(dateSelected, 'E').toLocaleLowerCase();

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
                                await updateHabitHistory(habit, dateSelected);
                                await handleMarkedDate(dateSelected);
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

        await handleMarkedDate(dateSelected);
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
            const newDateLastDay = format(removeDaysDate(day, 1), 'yyyy-MM-dd');
            const newDateNextDay = format(addDaysDate(day, 1), 'yyyy-MM-dd');

            const lastDay = history.find(item => format(item, 'yyyy-MM-dd') === newDateLastDay);
            const nextDay = history.find(item => format(item, 'yyyy-MM-dd') === newDateNextDay);

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

    async function handleSetScore() {
        const score = await getHabitScore(habit);
        setScore(score);
    }

    async function handleSetDataProgressByMonth() {
        const data = await getHabitHistoryCountByMonths(habit);
        setProgressByMonth(data);
    }

    useEffect(() => {
        handleMarkedDate(Date.now());
    }, [refreshHistoryCalendar]);

    useEffect(() => {
        handleSetDataProgressByMonth();
        handleSetScore();
    }, [calendarMarked])

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            statusBarTranslucent={true}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: getStatusBarHeight(),
                    paddingBottom: getBottomSpace() + 20,
                    backgroundColor: themes[theme].backgroundPrimary
                }}
            >
                <TouchableOpacity style={styles(theme).button} onPress={closeModal} activeOpacity={0.5}>
                    <MaterialIcons name="close" size={30} color={themes[theme].textPrimary} />
                </TouchableOpacity>
                <View style={styles(theme).header}>
                    <Text style={styles(theme).modalTitle}>{habit.name}</Text>
                    <View style={[styles(theme).countContainer, { backgroundColor: principalColor }]}>
                        <Text style={styles(theme).scoreCountText}>{score.amountPercentage}%</Text>
                    </View>
                </View>
                <Text style={styles(theme).subtitle}>histórico</Text>
                <View style={styles(theme).calendar}>
                    <HabitCalendar
                        calendarMarked={calendarMarked}
                        handleChangeSelectedDay={handleChangeSelectedDay}
                        color={principalColor}
                    />
                    {habit.endDate && isBefore(habit.endDate, Date.now()) &&
                        <Text style={styles(theme).disabledText}>este hábito está desabilitado.</Text>
                    }
                </View>
                {isPro ?
                    <View>
                        <Text style={styles(theme).subtitle}>score</Text>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingHorizontal: 20,
                                paddingVertical: 20,
                                marginRight: 20
                            }}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                        >
                            <ScoreCard
                                score={String(score.currentSequence)}
                                legend="seq. atual"
                                color={themes[theme].backgroundSecundary}
                            />
                            <ScoreCard
                                score={`${score.doneCount}x`}
                                legend="realizado"
                                color={themes[theme].backgroundSecundary}
                            />
                            <ScoreCard
                                score={String(score.currentSequence)}
                                legend="melhor seq."
                                color={themes[theme].backgroundSecundary}
                            />
                        </ScrollView>

                        <Text style={styles(theme).subtitle}>progresso</Text>
                        <View style={styles(theme).chart}>
                            <LineChart
                                segments={3}
                                fromZero
                                data={{
                                    labels: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
                                    datasets: [
                                        {
                                            data: progressByMonth,
                                            color: () => principalColor,
                                        }
                                    ]
                                }}
                                width={Dimensions.get("screen").width}
                                height={180}
                                withVerticalLines={false}
                                withHorizontalLines={false}
                                chartConfig={{
                                    backgroundGradientFrom: themes[theme].backgroundPrimary,
                                    backgroundGradientTo: themes[theme].backgroundPrimary,
                                    color: () => themes[theme].gray,
                                    labelColor: () => themes[theme].textPrimary,
                                    barPercentage: 0,
                                    useShadowColorFromDataset: false,
                                    decimalPlaces: 0
                                }}
                            />
                        </View>
                    </View>
                    :
                    <View style={styles(theme).proPurchaseContainer}>
                        <Text style={styles(theme).proPurchaseText}>
                            adquira o HabTool Pro e desbloqueie novos relatórios
                        </Text>
                    </View>
                }
            </ScrollView>
        </Modal>
    )
}

const styles = (theme: string) => StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20
    },
    modalTitle: {
        fontSize: RFValue(18),
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        marginRight: 10,
    },
    countContainer: {
        width: '20%',
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes[theme].blue,
        borderRadius: 10
    },
    scoreCountText: {
        fontSize: RFValue(14),
        fontFamily: fonts.contentBold,
        color: themes[theme].textSecundary
    },
    calendar: {
        width: '100%'
    },
    subtitle: {
        fontSize: RFValue(16),
        fontFamily: fonts.subtitle,
        color: themes[theme].textUnfocus,
        alignSelf: 'flex-start',
        paddingHorizontal: 20
    },
    disabledText: {
        fontSize: RFValue(14),
        fontFamily: fonts.content,
        color: themes[theme].textUnfocus,
        paddingLeft: 20,
        alignSelf: 'flex-start',
        paddingBottom: 10
    },
    chart: {
        marginTop: 20
    },
    button: {
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10
    },
    proPurchaseContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50
    },
    proPurchaseText: {
        fontSize: RFValue(14),
        fontFamily: fonts.subtitle,
        color: themes[theme].textUnfocus,
        textAlign: 'center'
    }
})
