import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import format from 'date-fns/format';
import pt from 'date-fns/locale/pt';

import { Tracker } from './Tracker';

import { addHabitHistory, FrequencyProps, getHabitWeekHistory, removeHabitHistory } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HabitProps {
    data: {
        id: string;
        name: string,
        frequency: FrequencyProps
    }
}

export function Habit({ data: habit }: HabitProps) {
    const [trackerCheckedPos0, setTrackerCheckedPos0] = useState(false);
    const [trackerCheckedPos1, setTrackerCheckedPos1] = useState(false);
    const [trackerCheckedPos2, setTrackerCheckedPos2] = useState(false);
    const [trackerCheckedPos3, setTrackerCheckedPos3] = useState(false);
    const [trackerCheckedPos4, setTrackerCheckedPos4] = useState(false);
    const [trackerCheckedPos5, setTrackerCheckedPos5] = useState(false);
    const [trackerCheckedPos6, setTrackerCheckedPos6] = useState(false);

    useEffect(() => {
        async function getWeekHistory() {
            const result = await getHabitWeekHistory(habit.id);
            console.log(result);
        }

        getWeekHistory();
    }, [])

    function getLegendDayTracker(position: number): string {
        const currentDate = new Date();
        return format(currentDate.setDate(currentDate.getDate() - position), 'EEEEE', { locale: pt }).toUpperCase();
    }

    function verifyEnabledTracker(position: number): boolean {
        const currentDate = new Date();
        const weekDay = format(currentDate.setDate(currentDate.getDate() - position), 'E').toLocaleLowerCase();
        return habit.frequency[weekDay];
    }

    async function handleCheckTracker(position: number): Promise<void> {
        switch (position) {
            case 0:
                setTrackerCheckedPos0((oldValue) => !oldValue);
                break;
            case 1:
                setTrackerCheckedPos1((oldValue) => !oldValue);
                break;
            case 2:
                setTrackerCheckedPos2((oldValue) => !oldValue);
                break;
            case 3:
                setTrackerCheckedPos3((oldValue) => !oldValue);
                break;
            case 4:
                setTrackerCheckedPos4((oldValue) => !oldValue);
                break;
            case 5:
                setTrackerCheckedPos5((oldValue) => !oldValue);
                break;
            case 6:
                setTrackerCheckedPos6((oldValue) => !oldValue);
                break;
            default:
                return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {habit.name}
            </Text>

            <View style={styles.tracker}>
                <Tracker
                    legend={getLegendDayTracker(6)}
                    enabled={verifyEnabledTracker(6)}
                    checked={trackerCheckedPos6}
                    onPress={() => handleCheckTracker(6)}
                />
                <Tracker
                    legend={getLegendDayTracker(5)}
                    enabled={verifyEnabledTracker(5)}
                    checked={trackerCheckedPos5}
                    onPress={() => handleCheckTracker(5)}
                />
                <Tracker
                    legend={getLegendDayTracker(4)}
                    enabled={verifyEnabledTracker(4)}
                    checked={trackerCheckedPos4}
                    onPress={() => handleCheckTracker(4)}
                />
                <Tracker
                    legend={getLegendDayTracker(3)}
                    enabled={verifyEnabledTracker(3)}
                    checked={trackerCheckedPos3}
                    onPress={() => handleCheckTracker(3)}
                />
                <Tracker
                    legend={getLegendDayTracker(2)}
                    enabled={verifyEnabledTracker(2)}
                    checked={trackerCheckedPos2}
                    onPress={() => handleCheckTracker(2)}
                />
                <Tracker
                    legend={getLegendDayTracker(1)}
                    enabled={verifyEnabledTracker(1)}
                    checked={trackerCheckedPos1}
                    onPress={() => handleCheckTracker(1)}
                />
                <Tracker
                    legend={getLegendDayTracker(0)}
                    enabled={verifyEnabledTracker(0)}
                    checked={trackerCheckedPos0}
                    onPress={() => handleCheckTracker(0)}
                />
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.grayLight,
        height: 100,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 10,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 10,
        justifyContent: 'space-around'
    },
    text: {
        color: colors.textDark,
        fontFamily: fonts.content,
        fontSize: 18
    },
    tracker: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 10
    }
})