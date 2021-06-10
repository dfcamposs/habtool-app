import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';


interface DateButtonProps extends TouchableOpacityProps {
    name: string;
    date?: string;
    clear?: () => void;
}

export function DateButton({ name, date, clear, ...rest }: DateButtonProps) {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={styles(theme).container}>
            <TouchableOpacity style={styles(theme).button} activeOpacity={0.3} {...rest}>
                <MaterialIcons
                    style={styles(theme).icon}
                    name="event"
                    size={28}
                    color={date ? themes[theme].blue : themes[theme].textUnfocus}
                />
                <Text style={[styles(theme).text, !!date && { color: themes[theme].textPrimary }]}>
                    {date || "selecionar data fim"}
                </Text>
            </TouchableOpacity>
            {!!clear && !!date && (
                <TouchableOpacity style={styles(theme).button} activeOpacity={0.3} onPress={clear}>
                    <Text style={[styles(theme).text, !!date && { color: themes[theme].textPrimary }]}>
                        clear
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: themes[theme].textUnfocus,
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
        fontSize: 15,
        fontFamily: fonts.content,
        color: themes[theme].textUnfocus
    }
})