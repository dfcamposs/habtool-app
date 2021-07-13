import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Platform, Image, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import * as Linking from 'expo-linking';
import { RFValue } from 'react-native-responsive-fontsize';

import { SettingsButton } from '../components/SettingsButton';
import { ThemeButton } from '../components/ThemeButton';

import { getCurrentTheme } from '../libs/theme.storage';

import { HabitsContext } from '../contexts/habits';
import { ThemeContext, ThemeEnum } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

export function Settings() {
    const [themeSelected, setThemeSelected] = useState<ThemeEnum>();

    const { theme, handleChange } = useContext(ThemeContext);
    const { myHabits } = useContext(HabitsContext);
    const { isPro } = useContext(UserContext);
    const navigation = useNavigation();

    function handleRateApp() {
        const storeId = "com.dfcamposs.habtool";

        if (Platform.OS === 'android') {
            return Linking.openURL(`https://play.google.com/store/apps/details?id=${storeId}&showAllReviews=true`)
        }

        return Linking.openURL(`https://apps.apple.com/app/apple-store/id${storeId}?action=write-review`);
    }

    function handleChangeTheme(theme: ThemeEnum) {
        if (!isPro) {
            return navigation.navigate('ProPurchase');
        }

        setThemeSelected(theme);
        handleChange(theme);
    }

    useEffect(() => {
        async function getTheme() {
            const currentTheme = await getCurrentTheme();
            setThemeSelected(currentTheme ? currentTheme : ThemeEnum.light);
        }

        getTheme();
    }, [])



    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            paddingTop: getStatusBarHeight(),
            alignItems: 'center'
        }}>
            <Text style={styles(theme).title}>configurações</Text>
            <View style={styles(theme).menu}>
                {!isPro &&
                    <>
                        <Text style={styles(theme).subtitle}>assinatura</Text>
                        <TouchableOpacity style={styles(theme).menuPro} activeOpacity={.7} onPress={!isPro ? () => navigation.navigate('ProPurchase') : () => { }}>
                            <Text style={styles(theme).menuProText}>👑  HabTool Pro</Text>
                        </TouchableOpacity>
                    </>
                }
                <Text style={styles(theme).subtitle}>tema</Text>
                <View style={styles(theme).themeContainer}>
                    <ThemeButton
                        title="sistema"
                        selected={themeSelected === ThemeEnum.default}
                        onPress={() => handleChangeTheme(ThemeEnum.default)}
                    />
                    <ThemeButton
                        title="claro"
                        selected={themeSelected === ThemeEnum.light}
                        onPress={() => handleChangeTheme(ThemeEnum.light)}
                    />
                    <ThemeButton
                        title="escuro"
                        selected={themeSelected === ThemeEnum.dark}
                        onPress={() => handleChangeTheme(ThemeEnum.dark)}
                    />
                </View>

                <Text style={styles(theme).subtitle}>sistema</Text>
                <SettingsButton title="ordenar hábitos" onPress={() => myHabits.length && navigation.navigate('SortHabits')} disabled={myHabits.length < 2} />
                <SettingsButton title="alterar como deseja ser chamado" onPress={() => navigation.navigate('Rename')} />

                <Text style={styles(theme).subtitle}>suporte</Text>
                <SettingsButton title="avaliar app" onPress={handleRateApp} />
                <SettingsButton title="contatar desenvolvedor" onPress={() => Linking.openURL('mailto:habtool.app@gmail.com')} />
            </View>
            <RectButton style={styles(theme).button} onPress={() => navigation.goBack()}>
                <Text style={styles(theme).textButton}>cancelar</Text>
            </RectButton>
        </ScrollView >
    )
}

const styles = (theme: string) => StyleSheet.create({
    title: {
        fontSize: RFValue(20),
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        paddingTop: 20
    },
    subtitle: {
        fontSize: RFValue(16),
        fontFamily: fonts.content,
        color: themes[theme].textPrimary,
        paddingRight: 20,
        paddingVertical: 20
    },
    button: {
        width: 120,
        height: 40,
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    textButton: {
        fontSize: RFValue(16),
        fontFamily: fonts.contentBold,
        color: themes[theme].textPrimary
    },
    menu: {
        flex: 1,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    themeContainer: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 20
    },
    menuPro: {
        height: 60,
        backgroundColor: themes[theme].backgroundPro,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        paddingLeft: 20
    },
    menuProText: {
        fontSize: RFValue(14),
        fontFamily: fonts.content,
        color: themes[theme].textSecundary,
        paddingRight: 20
    }
})
