import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface InputProps extends TextInputProps {
    name: string;
    icon?: 'flag' | 'event' | 'loop';
    center?: boolean;
}

export function Input({ name, icon, center = false, value, ...rest }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const theme = "dark";

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputBlur() {
        setIsFocused(false);
    }

    return (
        <View style={[
            styles(theme).container,
            (isFocused) && { borderColor: colors[theme].blue }
        ]}>
            {icon &&
                <MaterialIcons
                    style={styles(theme).icon}
                    name={icon}
                    size={28}
                    color={(isFocused || !!value || !!rest.defaultValue) ? colors[theme].blue : colors[theme].textUnfocus}
                />}
            <TextInput
                style={[styles(theme).input, center && { textAlign: 'center', width: '100%' }]}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                autoCapitalize={center ? 'sentences' : 'none'}
                placeholderTextColor={colors[theme].textUnfocus}
                {...rest}
            />
        </View>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors[theme].textUnfocus,
        marginVertical: 15,
        paddingVertical: 10
    },
    icon: {
        paddingRight: 10
    },
    input: {
        width: '90%',
        fontSize: 15,
        fontFamily: fonts.content,
        color: colors[theme].textPrimary
    }
})