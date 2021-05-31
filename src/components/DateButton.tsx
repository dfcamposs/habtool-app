import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface DateButtonProps extends TouchableOpacityProps {
    name: string;
    date?: string;
    clear?: () => void;
}

export function DateButton({ name, date, clear, ...rest }: DateButtonProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} activeOpacity={0.3} {...rest}>
                <MaterialIcons
                    style={styles.icon}
                    name="event"
                    size={28}
                    color={date ? colors.blue : colors.textUnfocus}
                />
                <Text style={[styles.text, !!date && { color: colors.textPrimary }]}>
                    {date || "selecionar data fim"}
                </Text>
            </TouchableOpacity>
            {!!clear && !!date && (
                <TouchableOpacity style={styles.button} activeOpacity={0.3} onPress={clear}>
                    <Text style={[styles.text, !!date && { color: colors.textPrimary }]}>
                        clear
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: colors.textUnfocus,
        marginVertical: 15,
        paddingVertical: 10,

    },
    button: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        paddingRight: 10
    },
    text: {
        fontSize: 14,
        fontFamily: fonts.content,
        color: colors.textUnfocus
    }
})