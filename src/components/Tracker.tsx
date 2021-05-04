import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface TrackerProps extends RectButtonProps {
    legend: string;
    disabled?: boolean;
    checked?: boolean;
}

export function Tracker({ legend, disabled = false, checked = false, ...rest }: TrackerProps) {
    return (
        <RectButton style={styles.container} {...rest}>
            <RectButton
                style={[
                    styles.dayCicle,
                    disabled && { backgroundColor: colors.grayDark },
                    checked && { backgroundColor: colors.green },
                ]}
            />
            <Text style={styles.dayLegend}>{legend}</Text>
        </RectButton>
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
        backgroundColor: colors.white
    },
    dayLegend: {
        color: colors.textDark,
        fontSize: 6,
        fontFamily: fonts.legend,
        marginTop: 5
    }
})