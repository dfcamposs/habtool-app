import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import logo from '../assets/logo.png';

export function Welcome() {
    const navigation = useNavigation();

    function handleSubmit() {
        navigation.navigate('MyHabits');
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Image style={styles.logo} source={logo} />
                                <Text style={styles.title}>
                                    como você deseja ser chamado?
                                </Text>
                            </View>

                            <Input name="username" placeholder="digite o nome" center />

                            <View style={styles.footer}>
                                <Button title="começar" onPress={handleSubmit} />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50
    },
    header: {
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 60,
        marginBottom: 30
    },
    title: {
        fontFamily: fonts.title,
        fontSize: 28,
        color: colors.textDark,
        textAlign: 'center'
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.textUnfocus,
        color: colors.textDark,
        width: '100%',
        fontSize: 16,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    footer: {
        width: '100%',
        marginTop: 30
    }
})