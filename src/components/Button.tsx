import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface ButtonProps extends RectButtonProps {
    title: string;
    onPress: () => void;
}

export function Button({ title, ...rest }: ButtonProps) {
    const { theme } = useContext(ThemeContext);

    return (
        <RectButton
            style={styles(theme).container}
            {...rest}
        >
            <Text style={styles(theme).text}>
                {title}
            </Text>
        </RectButton>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        backgroundColor: themes[theme].blue,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: themes[theme].textSecundary,
        fontFamily: fonts.contentBold
    }
})