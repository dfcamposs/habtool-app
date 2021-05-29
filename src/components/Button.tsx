import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonProps extends RectButtonProps {
    title: string;
    onPress: () => void;
}

export function Button({ title, ...rest }: ButtonProps) {
    return (
        <RectButton
            style={styles.container}
            {...rest}
        >
            <Text style={styles.text}>
                {title}
            </Text>
        </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.blue,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: colors.backgroundPrimary,
        fontFamily: fonts.contentBold
    }
})