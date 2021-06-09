import React, { useContext } from 'react';
import { Text, StyleSheet, SafeAreaView, View, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { SettingsButton } from '../components/SettingsButton';

import { HabitsContext } from '../context/habits';
import { ThemeContext } from '../context/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

export function Settings() {
    const { myHabits } = useContext(HabitsContext);
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    return (
        <SafeAreaView style={styles(theme).container}>
            <Text style={styles(theme).title}>configurações</Text>
            <View style={styles(theme).menu}>

                <Text style={styles(theme).subtitle}>sistema</Text>
                <SettingsButton title="ordenar hábitos" onPress={() => myHabits.length && navigation.navigate('SortHabits')} disabled={!myHabits.length} />
                <SettingsButton title="alterar como deseja ser chamado" onPress={() => navigation.navigate('Rename')} />

                <Text style={styles(theme).subtitle}>suporte</Text>
                <SettingsButton title="avaliar app" onPress={() => { }} />
                <SettingsButton title="contatar desenvolvedor" onPress={() => { }} />
            </View>
            <RectButton style={styles(theme).button} onPress={() => navigation.goBack()}>
                <Text style={styles(theme).textButton}>cancelar</Text>
            </RectButton>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    title: {
        fontSize: 20,
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        paddingTop: 20
    },
    subtitle: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary,
        paddingRight: 20,
        paddingVertical: 20
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    textButton: {
        fontSize: 16,
        fontFamily: fonts.contentBold,
        color: themes[theme].textPrimary
    },
    menu: {
        flex: 1,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
})
