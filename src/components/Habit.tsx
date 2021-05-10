import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import format from 'date-fns/format';

import { Tracker } from './Tracker';

import { FrequencyProps, getHabitWeekHistory } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HabitProps {
    data: {
        id: string;
        name: string,
        frequency: FrequencyProps
    }
}

interface TrackerListProps {
    position: number;
    checked: boolean;
}

export function Habit({ data: habit }: HabitProps) {
    const [trackerListProps, setTrackerListProps] = useState<TrackerListProps[]>();

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

        getWeekHistory();
    }, [])

    function verifyEnabledTracker(position: number): boolean {
        const currentDate = new Date();
        const weekDay = format(currentDate.setDate(currentDate.getDate() - position), 'E').toLocaleLowerCase();
        return habit.frequency[weekDay];
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
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