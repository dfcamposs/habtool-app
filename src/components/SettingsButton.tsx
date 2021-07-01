import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export function SettingsButton({ title, disabled, ...rest }: ButtonProps) {
    const { theme } = useContext(ThemeContext);
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles(theme).container}
            {...rest}
        >
            <Text style={[styles(theme).text, disabled && { color: themes[theme].textUnfocus }]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        backgroundColor: themes[theme].backgroundSecundary,
        justifyContent: 'center',
        padding: 20,
        marginBottom: 10,
        marginLeft: 20,
        borderRadius: 10
    },
    text: {
        fontSize: 14,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    }
})