import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    Image,
    Platform,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import {
    getProductsAsync,
    IAPResponseCode,
    purchaseItemAsync,
    connectAsync,
    setPurchaseListener,
    finishTransactionAsync
} from 'expo-in-app-purchases';

import { ThemeContext } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import { Button } from '../components/Button';

import themes from '../styles/themes';
import fonts from '../styles/fonts';
import Logo from '../assets/logo.png';

enum PlanEnum {
    good = "habtool_good",
    veryGood = "habtool_very_good",
    awesome = "habtool_amazing"
}

const features = [
    "tema escuro",
    "personalização de cores",
    "backup em nuvem",
    "novos relatórios",
    "múltiplos lembretes",
    "suporte preferencial"
];

const prices = [
    { productId: PlanEnum.good, price: "R$ 9.90", title: "gostei" },
    { productId: PlanEnum.veryGood, price: "R$ 14.90", title: "gostei muito" },
    { productId: PlanEnum.awesome, price: "R$ 19.90", title: "incrível" }
]

export function ProPurchase() {
    const [planSelected, setPlanSelected] = useState<PlanEnum>(PlanEnum.awesome);

    const { theme } = useContext(ThemeContext);
    const { handleUpdateIsPro } = useContext(UserContext);
    const navigation = useNavigation();

    async function getProductsAppStore() {
        await connectAsync().then(() => {
            setPurchaseListener(({ responseCode, results, errorCode }) => {
                if (responseCode === IAPResponseCode.OK) {
                    results.forEach((purchase: any) => {
                        if (!purchase.acknowledged) {
                            console.log(`Successfully purchased ${purchase.productId}`);
                            handleUpdateIsPro(true);
                            finishTransactionAsync(purchase, true);
                        }
                    });
                } else if (responseCode === IAPResponseCode.USER_CANCELED) {
                    console.log('User canceled the transaction');
                } else if (responseCode === IAPResponseCode.DEFERRED) {
                    console.log('User does not have permissions to buy but requested parental approval (iOS only)');
                } else {
                    console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
                }

                navigation.navigate('ConfirmationPurchase');
            })
        });

        const items = Platform.select({
            ios: [
                'dev.products.habtool_good',
                'dev.products.habtool_very_good',
                'dev.products.habtool_amazing',
            ],
            android: ['habtool_good', 'habtool_very_good', 'habtool_amazing'],
        }) as string[];

        const { responseCode } = await getProductsAsync(items);
        if (responseCode !== IAPResponseCode.OK) {
            Alert.alert("Serviço Indisponível", "tente novamente mais tarde");
        }
    }

    async function handlePurchase() {
        await purchaseItemAsync(planSelected);
        navigation.goBack();
    }

    useEffect(() => {
        getProductsAppStore();
    }, [])

    return (
        <SafeAreaView style={styles(theme).container}>
            <TouchableOpacity activeOpacity={.7} onPress={navigation.goBack}>
                <MaterialIcons style={styles(theme).close} name="close" size={30} color={themes[theme].textUnfocus} />
            </TouchableOpacity>
            <View style={styles(theme).content}>
                <View style={styles(theme).labelContainer}>
                    <Image style={styles(theme).logo} source={Logo} />
                    <Text style={styles(theme).title}>HabTool Pro</Text>
                </View>

                <Text style={styles(theme).labelText}>pagamento único</Text>

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
                        key={card.productId}
                        style={[
                            styles(theme).purchaseCard,
                            card.productId === planSelected
                            && { backgroundColor: themes[theme].blue }
                        ]}
                        onPress={() => setPlanSelected(card.productId)}
                    >
                        <Text
                            style={[
                                styles(theme).price,
                                card.productId === planSelected
                                && { color: themes[theme].textSecundary }
                            ]}
                        >
                            {card.price}
                        </Text>
                        <View style={styles(theme).legend}>
                            <Text style={styles(theme).legendText}>{card.title}</Text>
                        </View>
                    </TouchableOpacity>
                )
                }
            </View>
            <View style={styles(theme).footer}>
                <Button title="continuar" onPress={handlePurchase} />
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
        backgroundColor: themes[theme].backgroundPro,
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
        color: themes[theme].textSecundary
    },
    subtitle: {
        fontFamily: fonts.content,
        fontSize: 18,
        color: themes[theme].textPrimary,
        paddingVertical: 20
    },
    logo: {
        width: 70,
        height: 40,
        padding: 10,
        alignSelf: 'center'
    },
    labelContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
    },
    labelText: {
        fontFamily: fonts.contentBold,
        paddingVertical: 30,
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
        fontSize: 15,
        color: themes[theme].textSecundary
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
        backgroundColor: themes[theme].backgroundPro,
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