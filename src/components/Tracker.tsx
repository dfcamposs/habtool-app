import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacityProps, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

import { updateHabitHistory } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';

interface TrackerProps extends TouchableOpacityProps {
    data: {
        habitId: string;
        position: number;
    };
    enabled?: boolean;
    checked?: boolean;
}

export function Tracker({ data, checked = false, enabled = true, ...rest }: TrackerProps) {
    const { handleUpdatePercentageCheck, handleRefreshHistoryCalendar } = useContext(HabitsContext)
    const [trackerChecked, setTrackerChecked] = useState(checked);

    async function handleTrackerChecked() {
        setTrackerChecked((oldValue) => !oldValue);
        Haptics.impactAsync();

        const currentDate = new Date();
        const habitDate = currentDate.setDate(currentDate.getDate() - data.position);

        await updateHabitHistory(data.habitId, habitDate);
        handleUpdatePercentageCheck();
        handleRefreshHistoryCalendar();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={.7}
                style={[
                    styles.dayCicle,
                    enabled && { backgroundColor: colors.backgroundPrimary },
                    trackerChecked && { backgroundColor: colors.green },
                ]}
                disabled={!enabled}
                onPress={handleTrackerChecked}
                {...rest}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 7,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dayCicle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    }
})