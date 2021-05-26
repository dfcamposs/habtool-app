import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function SortHabits() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>sort</Text>
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