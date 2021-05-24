import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Settings() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Settings</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})