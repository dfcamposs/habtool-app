import React, { useContext } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';
import Logo from '../assets/logo.png';
import { Button } from '../components/Button';

const features = [
    "tema escuro",
    "personalização de cores",
    "backup em nuvem",
    "estatísticas detalhadas",
    "múltiplos lembretes",
    "suporte preferencial"
];

const prices = [
    { price: "R$ 9.90", label: "gostei" },
    { price: "R$ 14.90", label: "gostei muito" },
    { price: "R$ 19.90", label: "sensacional" }
]

export function ProPurchase() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles(theme).container}>
            <TouchableOpacity activeOpacity={.7} onPress={navigation.goBack}>
                <MaterialIcons style={styles(theme).close} name="close" size={30} color={themes[theme].textPrimary} />
            </TouchableOpacity>
            <View style={styles(theme).content}>
                <Text style={styles(theme).title}>Seja PRO</Text>
                <View style={styles(theme).labelContainer}>
                    <Image style={styles(theme).logo} source={Logo} />
                </View>

                <View style={styles(theme).labelContainer}>
                    <Text style={styles(theme).labelText}>pagamento único</Text>
                </View>

                {features.map(feature =>
                    <View key={feature} style={styles(theme).featureContainer}>
                        <MaterialIcons name="check" size={20} color={themes[theme].green} />
                        <Text style={styles(theme).featureText}>{feature}</Text>
                    </View>
                )
                }
            </View>

            <View style={styles(theme).purchaseContainer}>
                {prices.map(card =>
                    <TouchableOpacity activeOpacity={.7} key={card.price} style={styles(theme).purchaseCard}>
                        <Text style={styles(theme).price}>{card.price}</Text>
                        <View style={styles(theme).legend}>
                            <Text style={styles(theme).legendText}>{card.label}</Text>
                        </View>
                    </TouchableOpacity>
                )
                }
            </View>
            <View style={styles(theme).footer}>
                <Button title="continuar" onPress={() => { }} />
            </View>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
    },
    content: {
        width: '100%',
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        paddingVertical: 20
    },
    close: {
        alignSelf: 'flex-end',
        marginTop: '10%',
        paddingBottom: 20
    },
    title: {
        fontFamily: fonts.subtitle,
        textAlign: 'center',
        fontSize: 24,
        color: themes[theme].textPrimary
    },
    logo: {
        width: 110,
        height: 60,
        padding: 10
    },
    labelContainer: {
        backgroundColor: themes[theme].textPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 20
    },
    labelText: {
        fontFamily: fonts.content,
        padding: 10,
        textAlign: 'center',
        fontSize: 14,
        color: themes[theme].textSecundary
    },
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    featureText: {
        fontFamily: fonts.content,
        padding: 10,
        fontSize: 16,
        color: themes[theme].textPrimary
    },
    purchaseContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    purchaseCard: {
        width: '30%',
        height: 100,
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10
    },
    price: {
        fontFamily: fonts.subtitle,
        textAlign: 'center',
        fontSize: 20,
        color: themes[theme].textPrimary
    },
    legend: {
        backgroundColor: themes[theme].textPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    legendText: {
        fontFamily: fonts.content,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 10,
        color: themes[theme].textSecundary
    },
    footer: {
        paddingVertical: 20
    }
})