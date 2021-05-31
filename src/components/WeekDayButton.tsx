import React from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface WeekDayButton extends TouchableOpacityProps {
    title: string;
    active?: boolean;
}

export function WeekDayButton({ title, active = false, ...rest }: WeekDayButton) {
    return (
        <TouchableOpacity
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
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.backgroundSecundary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        fontFamily: fonts.content,
        color: colors.textPrimary
    }
})