import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface ThemeButtonProps extends TouchableOpacityProps {
    title: string,
    selected?: boolean
}

export function ThemeButton({ title, selected = false, ...rest }: ThemeButtonProps) {
    const { theme } = useContext(ThemeContext);

    return (
        <TouchableOpacity
            style={[
                styles(theme).container,
                selected && { backgroundColor: themes[theme].blue }
            ]}
            activeOpacity={.7}
            {...rest}>
            <Text
                style={[
                    styles(theme).text,
                    selected && { color: themes[theme].textSecundary }
                ]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        width: '30%',
        padding: 10,
        backgroundColor: themes[theme].backgroundSecundary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2.5,
        borderRadius: 10
    },
    text: {
        fontSize: 14,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary
    }
})