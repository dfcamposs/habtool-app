import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Welcome() {
    const navigation = useNavigation();

    function handleSubmit() {
        navigation.navigate('MyHabits');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text
                    style={styles.buttonText}
                    onPress={handleSubmit}
                >
                    Prosseguir
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 150,
        height: 45,
        backgroundColor: colors.blue,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: colors.white,
        fontFamily: fonts.contentBold,
        fontSize: 16
    }
})