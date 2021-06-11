import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacityProps, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

import { updateHabitHistory } from '../libs/storage';
import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';

import { ColorEnum } from './ColorTrackList';

import themes from '../styles/themes';

interface TrackerProps extends TouchableOpacityProps {
    data: {
        habitId: string;
        position: number;
    };
    enabled?: boolean;
    checked?: boolean;
    color?: ColorEnum;
}

export function Tracker({ data, checked = false, enabled = true, color = ColorEnum.default, ...rest }: TrackerProps) {
    const { handleUpdatePercentageCheck, handleRefreshHistoryCalendar } = useContext(HabitsContext)
    const [trackerChecked, setTrackerChecked] = useState(checked);
    const { theme } = useContext(ThemeContext);

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
        <View style={styles(theme).container}>
            <TouchableOpacity
                activeOpacity={.7}
                style={[
                    styles(theme).dayCicle,
                    enabled && { backgroundColor: themes[theme].backgroundPrimary },
                    trackerChecked && { backgroundColor: color },
                ]}
                disabled={!enabled}
                onPress={handleTrackerChecked}
                {...rest}
            />
        </View>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        marginLeft: 7,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dayCicle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: themes[theme].gray,
        alignItems: 'center',
        justifyContent: 'center',
    }
})