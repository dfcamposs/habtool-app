import React, { useContext } from 'react';
import { Text, StyleSheet, SafeAreaView, View, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import * as Linking from 'expo-linking';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { SettingsButton } from '../components/SettingsButton';
import { HabitsContext } from '../context/habits';

export function Settings() {
    const { myHabits } = useContext(HabitsContext);
    const navigation = useNavigation();

    function handleRateApp() {
        const storeId = "com.dfcamposs.habtool";

        if (Platform.OS === 'android') {
            return Linking.openURL(`https://play.google.com/store/apps/details?id=${storeId}&showAllReviews=true`)
        }

        return Linking.openURL(`https://apps.apple.com/app/apple-store/id${storeId}?action=write-review`);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>configurações</Text>
            <View style={styles.menu}>

                <Text style={styles.subtitle}>sistema</Text>
                <SettingsButton title="ordenar hábitos" onPress={() => myHabits.length && navigation.navigate('SortHabits')} disabled={!myHabits.length} />
                <SettingsButton title="alterar como deseja ser chamado" onPress={() => navigation.navigate('Rename')} />

                <Text style={styles.subtitle}>suporte</Text>
                <SettingsButton title="avaliar app" onPress={handleRateApp} />
                <SettingsButton title="contatar desenvolvedor" onPress={() => Linking.openURL('mailto:fernandesc.david@gmail.com')} />
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
        fontSize: 20,
        fontFamily: fonts.title,
        color: colors.textPrimary,
        paddingTop: 20
    },
    subtitle: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: colors.textPrimary,
        paddingRight: 20,
        paddingVertical: 20
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: colors.backgroundSecundary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    textButton: {
        fontSize: 16,
        fontFamily: fonts.contentBold,
        color: colors.textPrimary
    },
    menu: {
        flex: 1,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
})
