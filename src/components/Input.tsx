import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface InputProps extends TextInputProps {
    name: string;
    icon?: 'flag' | 'event';
    center?: boolean;
}

export function Input({ name, icon, center = false, ...rest }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [value, setValue] = useState<string>();

    function handleInputFocus() {
        setIsFocused(true);
        setIsFilled(!!value);
    }

    function handleInputBlur() {
        setIsFocused(false);
    }

    function handleInputChange(text: string) {
        setIsFilled(!!text);
        setValue(text);
    }

    return (
        <View style={[
            styles.container,
            (isFocused || isFilled) && { borderColor: colors.blue }
        ]}>
            {icon &&
                <MaterialIcons
                    style={styles.icon}
                    name={icon}
                    size={28}
                    color={(isFocused || isFilled) ? colors.blue : colors.textUnfocus}
                />}
            <TextInput
                style={[styles.input, center && { textAlign: 'center' }]}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChangeText={handleInputChange}
                {...rest}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.textUnfocus,
        marginVertical: 15,
        paddingVertical: 10,
    },
    icon: {
        paddingRight: 10
    },
    input: {
        width: '100%',
        fontSize: 18,
        fontFamily: fonts.content,
        color: colors.textDark
    }
})