import React, { useContext } from 'react';
import { ScrollView, Text, StyleSheet, View, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Button } from '../components/Button';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';
import Logo from '../assets/logo.png';

const features = [
    "tema escuro",
    "personalização de cores",
    "backup em nuvem",
    "novos relatórios",
    "múltiplos lembretes",
    "suporte preferencial"
];

export function ConfirmationPurchase() {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    function handleNavigate() {
        navigation.navigate('AppRoutes');
    }

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            paddingHorizontal: 40,
            paddingTop: getStatusBarHeight(),
            alignItems: 'center'
        }}>
            <Image style={styles(theme).logo} source={Logo} />
            <Text style={styles(theme).title}>Obrigado por ser Pro!</Text>
            <View style={styles(theme).features}>
                <Text style={styles(theme).subtitle}>agora você tem acesso: </Text>
                {features.map(feature =>
                    <View key={feature} style={styles(theme).featureContainer}>
                        <MaterialIcons name="check" size={20} color={themes[theme].green} />
                        <Text style={styles(theme).featureText}>{feature}</Text>
                    </View>
                )
                }
            </View>
            <View style={styles(theme).footer}>
                <Button title="explorar" onPress={handleNavigate} />
            </View>
        </ScrollView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    logo: {
        width: 120,
        height: 60,
        marginBottom: 20,
        marginTop: '25%',
    },
    title: {
        fontFamily: fonts.title,
        fontSize: 24,
        color: themes[theme].textPrimary,
        textAlign: 'center',
        marginHorizontal: 30,
    },
    subtitle: {
        fontFamily: fonts.contentBold,
        fontSize: 15,
        color: themes[theme].textPrimary,
        alignSelf: 'flex-start',
        marginBottom: 10
    },
    features: {
        width: '100%',
        backgroundColor: themes[theme].backgroundSecundary,
        padding: 20,
        borderRadius: 10,
        marginVertical: 10
    },
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    featureText: {
        fontFamily: fonts.content,
        padding: 10,
        fontSize: 15,
        color: themes[theme].textPrimary
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
    footer: {
        width: '50%',
        paddingVertical: 20
    }
})
