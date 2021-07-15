import React, { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { RFValue } from 'react-native-responsive-fontsize';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

export function Confirmation() {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    function handleNavigateToMyHabits() {
        navigation.navigate('hábitos');
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <Text style={styles(theme).title}>hábito salvo {'\n'} com sucesso!</Text>
            <RectButton style={styles(theme).button} onPress={handleNavigateToMyHabits}>
                <MaterialIcons name="done" size={40} color={themes[theme].backgroundPrimary} />
            </RectButton>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    title: {
        fontFamily: fonts.title,
        fontSize: RFValue(24),
        color: themes[theme].textPrimary,
        textAlign: 'center',
        paddingVertical: '30%'
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: themes[theme].green,
        alignItems: 'center',
        justifyContent: 'center'
    }
})