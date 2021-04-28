import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MyHabits() {
    return (
        <View style={styles.container}>
            <Text>My Habits</Text>
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