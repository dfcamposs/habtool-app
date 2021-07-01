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

import { UserContext } from '../contexts/user';
import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

export function Welcome() {
    const [name, setName] = useState<string>();

    const navigation = useNavigation();
    const { userName, handleUpdateUserName } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        if (userName) {
            setName(userName);
        }
    }, [])

    async function handleSubmit() {
        if (!name)
            return Alert.alert('Não é possível deixar seu nome em branco!');

        handleUpdateUserName(name);
        navigation.navigate('AppRoutes');
    }

    function handleInputChange(value: string) {
        setName(value);
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <KeyboardAvoidingView
                style={[styles(theme).container, !(!!userName) && { paddingHorizontal: 20 }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        {!userName &&
                            <View style={styles(theme).welcome}>
                                <Text style={styles(theme).title}>seja bem-vindo!</Text>
                                <Image style={styles(theme).logo} source={Logo} />
                            </View>
                        }
                        <View style={[
                            styles(theme).content,
                            !!userName && {
                                flex: 1,
                                justifyContent: 'space-between',
                                backgroundColor: themes[theme].backgroundPrimary
                            }
                        ]}>
                            <View>
                                <Text style={styles(theme).subtitle}>
                                    como você se chama?
                                </Text>

                                <Input name="username" defaultValue={userName} placeholder="digite o nome" onChangeText={handleInputChange} center />
                            </View>
                            <View style={styles(theme).footer}>
                                <Button title={userName ? "alterar" : "começar"} onPress={handleSubmit} />
                            </View>
                        </View>


                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
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
        backgroundColor: themes[theme].backgroundSecundary,
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
        color: themes[theme].textPrimary,
        alignSelf: 'center',
        paddingBottom: 50
    },
    subtitle: {
        fontFamily: fonts.subtitle,
        fontSize: 20,
        color: themes[theme].textPrimary,
        alignSelf: 'center',
        paddingBottom: 30
    },
    input: {
        borderBottomWidth: 1,
        borderColor: themes[theme].textUnfocus,
        color: themes[theme].textPrimary,
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