import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { updateHabitHistory } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';

interface TrackerProps extends RectButtonProps {
    data: {
        habitId: string;
        position: number;
    };
    enabled?: boolean;
    checked?: boolean;
}

export function Tracker({ data, checked = false, enabled = true, ...rest }: TrackerProps) {
    const { handleUpdatePercentageCheck } = useContext(HabitsContext)
    const [trackerChecked, setTrackerChecked] = useState(checked);

    async function handleTrackerChecked() {
        const currentDate = new Date();
        const habitDate = currentDate.setDate(currentDate.getDate() - data.position);

        await updateHabitHistory(data.habitId, habitDate);
        handleUpdatePercentageCheck();
        setTrackerChecked((oldValue) => !oldValue);
    }

    return (
        <View style={styles.container}>
            <RectButton
                style={[
                    styles.dayCicle,
                    enabled && { backgroundColor: colors.backgroundPrimary },
                    trackerChecked && { backgroundColor: colors.green },
                ]}
                enabled={enabled}
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
        backgroundColor: colors.gray
    }
})