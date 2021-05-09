import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Confirmation() {
    return (
        <View style={styles.container}>
            <Text>Confirmation</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})