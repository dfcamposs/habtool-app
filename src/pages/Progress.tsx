import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Progress() {
    return (
        <View style={styles.container}>
            <Text>Progress</Text>
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