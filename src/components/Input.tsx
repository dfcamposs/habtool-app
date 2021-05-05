import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface InputProps extends TextInputProps {
    name: string;
    icon?: string;
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
        <TextInput
            style={[
                styles.container,
                (isFocused || isFilled) && { borderColor: colors.blue },
                center && { textAlign: 'center' }
            ]}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChangeText={handleInputChange}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: colors.textUnfocus,
        color: colors.textDark,
        width: '100%',
        fontSize: 18,
        marginVertical: 15,
        padding: 10,
        fontFamily: fonts.content
    }
})