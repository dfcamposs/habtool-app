import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Confirmation() {
    const navigation = useNavigation();
    const theme = "dark";

    function handleNavigateToMyHabits() {
        navigation.navigate('hábitos');
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <Text style={styles(theme).title}>hábito salvo {'\n'} com sucesso!</Text>
            <RectButton style={styles(theme).button} onPress={handleNavigateToMyHabits}>
                <MaterialIcons name="done" size={40} color={colors[theme].backgroundPrimary} />
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
        fontSize: 24,
        color: colors[theme].textPrimary,
        textAlign: 'center',
        marginHorizontal: 30,
        paddingTop: '40%',
        paddingBottom: '30%',
        paddingVertical: '30%'
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors[theme].green,
        alignItems: 'center',
        justifyContent: 'center'
    }
})