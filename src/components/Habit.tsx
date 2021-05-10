import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import format from 'date-fns/format';
import pt from 'date-fns/locale/pt';

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

export function Habit({ data: habit }: HabitProps) {
    useEffect(() => {
        async function getWeekHistory() {
            const result = await getHabitWeekHistory(habit.id);
            console.log(result);
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
                data={[6, 5, 4, 3, 2, 1, 0]}
                keyExtractor={(item) => String(item)}
                renderItem={({ item: position }) => (
                    <Tracker
                        data={{ habitId: habit.id, position }}
                        enabled={verifyEnabledTracker(position)}
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