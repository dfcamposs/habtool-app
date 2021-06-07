import React, { useContext, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

import { saveUserName } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Welcome() {
    const [name, setName] = useState<string>();

    const navigation = useNavigation();
    const { userName, handleUpdateUserName } = useContext(HabitsContext);

    async function handleSubmit() {
        if (!name)
            return Alert.alert('Me diz como chamar você 😢');

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
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    como você deseja ser chamado?
                                </Text>
                            </View>

                            <Input name="username" defaultValue={userName} placeholder="digite o nome" onChangeText={handleInputChange} center />

                            <View style={styles.footer}>
                                <Button title={userName ? "alterar" : "começar"} onPress={handleSubmit} />
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
        paddingHorizontal: 30,
        paddingTop: '40%'
    },
    header: {
        alignItems: 'center'
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
        textAlign: 'center',
        paddingBottom: 50
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
        marginTop: 20
    }
})