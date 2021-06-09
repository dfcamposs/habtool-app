import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface WeekDayButton extends TouchableOpacityProps {
    title: string;
    active?: boolean;
}

export function WeekDayButton({ title, active = false, ...rest }: WeekDayButton) {
    const theme = "dark";
    return (
        <TouchableOpacity
            style={[
                styles(theme).container,
                active && { backgroundColor: colors[theme].blue }
            ]}
            activeOpacity={0.7}
            {...rest}
        >
            <Text style={[styles(theme).text, active && { color: colors[theme].textSecundary }]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors[theme].backgroundSecundary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    text: {
        fontSize: 12,
        fontFamily: fonts.content,
        color: colors[theme].textPrimary
    }
})