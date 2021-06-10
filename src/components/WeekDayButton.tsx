import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface WeekDayButton extends TouchableOpacityProps {
    title: string;
    active?: boolean;
}

export function WeekDayButton({ title, active = false, ...rest }: WeekDayButton) {
    const { theme } = useContext(ThemeContext);
    return (
        <TouchableOpacity
            style={[
                styles(theme).container,
                active && { backgroundColor: themes[theme].blue }
            ]}
            activeOpacity={0.7}
            {...rest}
        >
            <Text style={[styles(theme).text, active && { color: themes[theme].textSecundary }]}>
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
        backgroundColor: themes[theme].backgroundSecundary,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2
    },
    text: {
        fontSize: 12,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    }
})