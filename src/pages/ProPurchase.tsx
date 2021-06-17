import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    Image,
    Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { ThemeContext } from '../contexts/themes';

import { Button } from '../components/Button';

import themes from '../styles/themes';
import fonts from '../styles/fonts';
import Logo from '../assets/logo.png';

enum PlanEnum {
    good = "good",
    veryGood = "very-good",
    awesome = "awesome"
}

const features = [
    "tema escuro",
    "personalização de cores",
    "backup em nuvem",
    "estatísticas detalhadas",
    "múltiplos lembretes",
    "suporte preferencial"
];

const prices = [
    { id: PlanEnum.good, price: "R$ 9.90", label: "gostei" },
    { id: PlanEnum.veryGood, price: "R$ 14.90", label: "gostei muito" },
    { id: PlanEnum.awesome, price: "R$ 19.90", label: "incrível" }
]

export function ProPurchase() {
    const [planSelected, setPlanSelected] = useState<PlanEnum>(PlanEnum.awesome);

    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles(theme).container}>
            <TouchableOpacity activeOpacity={.7} onPress={navigation.goBack}>
                <MaterialIcons style={styles(theme).close} name="close" size={30} color={themes[theme].textUnfocus} />
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

            <Text style={styles(theme).subtitle}>selecione o plano</Text>
            <View style={styles(theme).purchaseContainer}>
                {prices.map(card =>
                    <TouchableOpacity
                        activeOpacity={.7}
                        key={card.id}
                        style={[
                            styles(theme).purchaseCard,
                            card.id === planSelected
                            && { backgroundColor: themes[theme].blue }
                        ]}
                        onPress={() => setPlanSelected(card.id)}
                    >
                        <Text
                            style={[
                                styles(theme).price,
                                card.id === planSelected
                                && { color: themes[theme].textSecundary }
                            ]}
                        >
                            {card.price}
                        </Text>
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
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0
    },
    content: {
        width: '100%',
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        paddingVertical: 20
    },
    close: {
        alignSelf: 'flex-end',
        paddingBottom: 20
    },
    title: {
        fontFamily: fonts.subtitle,
        textAlign: 'center',
        fontSize: 24,
        color: themes[theme].textPrimary
    },
    subtitle: {
        fontFamily: fonts.content,
        fontSize: 18,
        color: themes[theme].textPrimary,
        paddingVertical: 20
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
        padding: 5,
        fontSize: 15,
        color: themes[theme].textPrimary
    },
    purchaseContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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