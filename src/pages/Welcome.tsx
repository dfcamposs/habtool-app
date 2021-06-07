import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Logo from '../assets/logo.png';

import { saveUserName } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Welcome() {
    const [name, setName] = useState<string>();

    const navigation = useNavigation();
    const { userName, handleUpdateUserName } = useContext(HabitsContext);

    useEffect(() => {
        if (userName) {
            setName(userName);
        }
    }, [])

    async function handleSubmit() {
        if (!name)
            return Alert.alert('Não é possível deixar seu nome em branco!');

        await saveUserName(name);
        handleUpdateUserName(name);
        navigation.navigate('AppRoutes');
    }

    function handleInputChange(value: string) {
        setName(value);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={[styles.container, !(!!userName) && { paddingHorizontal: 20 }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        {!userName &&
                            <View style={styles.welcome}>
                                <Text style={styles.title}>seja bem-vindo!</Text>
                                <Image style={styles.logo} source={Logo} />
                            </View>
                        }
                        <View style={[
                            styles.content,
                            !!userName && {
                                flex: 1,
                                justifyContent: 'space-between',
                                backgroundColor: colors.backgroundPrimary
                            }
                        ]}>
                            <View>
                                <Text style={styles.subtitle}>
                                    como você se chama?
                                </Text>

                                <Input name="username" defaultValue={userName} placeholder="digite o nome" onChangeText={handleInputChange} center />
                            </View>
                            <View style={styles.footer}>
                                <Button title={userName ? "alterar" : "começar"} onPress={handleSubmit} />
                            </View>
                        </View>


                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: getStatusBarHeight()
    },
    welcome: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%'
    },
    content: {
        alignItems: 'center',
        backgroundColor: colors.backgroundSecundary,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    logo: {
        width: 120,
        height: 60,
        marginBottom: 50
    },
    title: {
        fontFamily: fonts.title,
        fontSize: 24,
        color: colors.textPrimary,
        alignSelf: 'center',
        paddingBottom: 50
    },
    subtitle: {
        fontFamily: fonts.subtitle,
        fontSize: 20,
        color: colors.textPrimary,
        alignSelf: 'center',
        paddingBottom: 30
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.textUnfocus,
        color: colors.textPrimary,
        width: '100%',
        fontSize: 15,
        padding: 10,
        textAlign: 'center'
    },
    footer: {
        width: '100%',
        paddingTop: 20
    }
})