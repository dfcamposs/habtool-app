import React from 'react';
import { Text, StyleSheet, SafeAreaView, View, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { SettingsButton } from '../components/SettingsButton';

export function Settings() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>configurações</Text>
            <View style={styles.menu}>

                <Text style={styles.subtitle}>sistema</Text>
                <SettingsButton title="ordenar hábitos" onPress={() => navigation.navigate('SortHabits')} />
                <SettingsButton title="alterar como deseja ser chamado" onPress={() => navigation.navigate('Rename')} />

                <Text style={styles.subtitle}>suporte</Text>
                <SettingsButton title="avaliar app" onPress={() => { }} />
                <SettingsButton title="contatar desenvolvedor" onPress={() => { }} />
            </View>
            <RectButton style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.textButton}>cancelar</Text>
            </RectButton>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.title,
        color: colors.textDark,
        paddingTop: 20
    },
    subtitle: {
        fontSize: 18,
        fontFamily: fonts.content,
        color: colors.textDark,
        paddingRight: 20,
        paddingVertical: 20
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    textButton: {
        fontSize: 16,
        fontFamily: fonts.contentBold,
        color: colors.textDark
    },
    menu: {
        flex: 1,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
})
