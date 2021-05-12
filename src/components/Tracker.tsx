import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { updateHabitHistory } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

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

    function getLegendDayTracker(position: number): string {
        const currentDate = new Date();
        return format(currentDate.setDate(currentDate.getDate() - position), 'EEEEE', { locale: pt }).toUpperCase();
    }

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
                    enabled && { backgroundColor: colors.white },
                    trackerChecked && { backgroundColor: colors.green },
                ]}
                enabled={enabled}
                onPress={handleTrackerChecked}
                {...rest}
            />
            <Text style={[
                styles.dayLegend,
                data.position === 0 && { fontFamily: fonts.legendBold },
                enabled && { color: colors.textDark }
            ]}>{getLegendDayTracker(data.position)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        maxHeight: 40
    },
    dayCicle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: colors.grayDark
    },
    dayLegend: {
        color: colors.textUnfocus,
        fontSize: 6,
        fontFamily: fonts.legend,
        marginTop: 5
    }
})