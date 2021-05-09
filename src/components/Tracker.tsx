import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface TrackerProps extends RectButtonProps {
    legend: string;
    enabled?: boolean;
    checked?: boolean;
}

export function Tracker({ legend, enabled = true, checked = false, ...rest }: TrackerProps) {
    return (
        <View style={styles.container}>
            <RectButton
                style={[
                    styles.dayCicle,
                    enabled && { backgroundColor: colors.white },
                    checked && { backgroundColor: colors.green },
                ]}
                enabled={enabled}
                {...rest}
            />
            <Text style={styles.dayLegend}>{legend}</Text>
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
        color: colors.textDark,
        fontSize: 6,
        fontFamily: fonts.legend,
        marginTop: 5
    }
})