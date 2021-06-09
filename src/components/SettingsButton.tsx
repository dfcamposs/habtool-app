import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export function SettingsButton({ title, disabled, ...rest }: ButtonProps) {
    const theme = "dark";
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles(theme).container}
            {...rest}
        >
            <Text style={[styles(theme).text, disabled && { color: colors[theme].textUnfocus }]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        backgroundColor: colors[theme].backgroundSecundary,
        justifyContent: 'center',
        padding: 20,
        marginBottom: 10,
        marginLeft: 20,
        borderRadius: 10
    },
    text: {
        fontSize: 14,
        fontFamily: fonts.content,
        color: colors[theme].textPrimary
    }
})