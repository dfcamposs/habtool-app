import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export function SettingsButton({ title, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.container}
            {...rest}
        >
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundSecundary,
        justifyContent: 'center',
        padding: 20,
        marginBottom: 10,
        marginLeft: 20,
        borderRadius: 10
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: colors.textPrimary
    }
})