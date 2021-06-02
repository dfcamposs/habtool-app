import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface WeekDayButton extends RectButtonProps {
    title: string;
    active?: boolean;
}

export function WeekDayButton({ title, active = false, ...rest }: WeekDayButton) {
    return (
        <RectButton
            style={[
                styles.container,
                active && { backgroundColor: colors.blue }
            ]}
            activeOpacity={0.7}
            {...rest}
        >
            <Text style={[styles.text, active && { color: colors.textSecundary }]}>
                {title}
            </Text>
        </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.backgroundSecundary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    text: {
        fontSize: 12,
        fontFamily: fonts.content,
        color: colors.textPrimary
    }
})