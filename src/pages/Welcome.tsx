import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

import { getUserName, saveUserName } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import logo from '../assets/logo.png';


export function Welcome() {
    const [name, setName] = useState<string>();

    const navigation = useNavigation();

    useEffect(() => {
        async function findUserName() {
            const userName = await getUserName();

            if (userName)
                navigation.navigate('MyHabits');

        }

        findUserName();
    }, []);

    async function handleSubmit() {
        if (!name)
            return Alert.alert('Me diz como chamar você 😢');

        await saveUserName(name);
        navigation.navigate('CreateHabit');
    }

    function handleInputChange(value: string) {
        setName(value);
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

                            <Input name="username" placeholder="digite o nome" onChangeText={handleInputChange} center />

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
        paddingHorizontal: 50,
        paddingVertical: 100
    },
    header: {
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 80,
        marginBottom: 30
    },
    title: {
        fontFamily: fonts.title,
        fontSize: 28,
        color: colors.textDark,
        textAlign: 'center',
        paddingBottom: 50
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.textUnfocus,
        color: colors.textDark,
        width: '100%',
        fontSize: 16,
        padding: 10,
        textAlign: 'center'
    },
    footer: {
        width: '100%',
        marginTop: 30
    }
})