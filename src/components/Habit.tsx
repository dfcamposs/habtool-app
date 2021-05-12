import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, Animated } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';

import { Tracker } from './Tracker';

import { FrequencyProps, getHabitWeekHistory } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HabitProps {
    data: {
        id: string;
        name: string,
        frequency: FrequencyProps,
        endDate?: number;
    }
}

interface TrackerListProps {
    position: number;
    checked: boolean;
}

export function Habit({ data: habit }: HabitProps) {
    const [trackerListProps, setTrackerListProps] = useState<TrackerListProps[]>();
    const [habitIsActive, setHabitIsActive] = useState(true);

    useEffect(() => {
        async function getWeekHistory() {
            const initialTrackerList: TrackerListProps[] = [
                { position: 6, checked: false },
                { position: 5, checked: false },
                { position: 4, checked: false },
                { position: 3, checked: false },
                { position: 2, checked: false },
                { position: 1, checked: false },
                { position: 0, checked: false },
            ]

            const history = await getHabitWeekHistory(habit.id);

            const historyFormatted = history.map((item: number) => format(item, 'dd-MM-yyyy'));

            for (const item of initialTrackerList) {
                const currentDate = new Date();
                const date = format(currentDate.setDate(currentDate.getDate() - item.position), 'dd-MM-yyyy');

                if (historyFormatted.includes(date)) {
                    item.checked = true
                }
            }

            setTrackerListProps(initialTrackerList);
        }

        function verifyEndDate() {
            if (habit.endDate && habit.endDate < Date.now())
                setHabitIsActive(false);
        }

        getWeekHistory();
        verifyEndDate();
    }, [])

    function verifyEnabledTracker(position: number): boolean {
        if (!habitIsActive) {
            return false;
        }

        const currentDate = new Date();
        const weekDay = format(currentDate.setDate(currentDate.getDate() - position), 'E').toLocaleLowerCase();
        return habit.frequency[weekDay];
    }

    return (
        <Swipeable
            overshootRight={false}
            renderRightActions={() => (
                <Animated.View>
                    <View style={{ flexDirection: 'row' }}>
                        <RectButton
                            style={styles.editButton}
                            onPress={() => { }}
                        >
                            <MaterialIcons name="edit" size={20} color={colors.white} />
                        </RectButton>
                        <RectButton
                            style={styles.removeButton}
                            onPress={() => { }}
                        >
                            <MaterialIcons name="delete" size={20} color={colors.white} />
                        </RectButton>
                    </View>
                </Animated.View>
            )}
        >
            <View style={styles.container}>
                <Text style={[styles.text, habitIsActive && { color: colors.textDark }]}>
                    {habit.name}
                </Text>

                <FlatList
                    data={trackerListProps}
                    keyExtractor={(item) => String(item.position)}
                    renderItem={({ item }) => (
                        <Tracker
                            data={{ habitId: habit.id, position: item.position }}
                            enabled={verifyEnabledTracker(item.position)}
                            checked={item.checked}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    style={styles.tracker}
                />
            </View>
        </Swipeable>
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
    editButton: {
        width: 60,
        height: 100,
        backgroundColor: colors.blue,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 20,
    },
    removeButton: {
        width: 60,
        height: 100,
        backgroundColor: colors.red,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 20,
    },
    text: {
        color: colors.textUnfocus,
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