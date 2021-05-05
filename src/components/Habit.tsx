import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Tracker } from './Tracker';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HabitProps {
    data: {
        id: string;
        name: string;
    }
}

export function Habit({ data: habit }: HabitProps) {
    const [trackerChecked, setTrackerChecked] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {habit.name}
            </Text>

            <View style={styles.tracker}>
                <Tracker legend="D" checked />
                <Tracker legend="S" disabled />
                <Tracker legend="T" disabled />
                <Tracker legend="Q" checked />
                <Tracker legend="Q" checked />
                <Tracker legend="S" />
                <Tracker legend="S" checked={trackerChecked} onPress={() => setTrackerChecked((oldValue) => !oldValue)} />
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