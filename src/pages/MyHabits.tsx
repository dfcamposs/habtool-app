import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

import { Habit } from '../components/Habit';
import { Stars } from '../components/Stars';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyHabits() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Olá, David</Text>
                <Text style={styles.subtitle}>seja 1% melhor todos os dias</Text>

                <Stars />
            </View>
            <View style={styles.content}>
                <FlatList
                    data={[
                        { id: "1", name: "habit 1" },
                        { id: "2", name: "habit 2" },
                        { id: "3", name: "habit 3" },
                        { id: "4", name: "habit 4" },
                        { id: "5", name: "habit 5" },
                        { id: "6", name: "habit 6" },
                        { id: "7", name: "habit 7" },
                        { id: "8", name: "habit 8" },
                        { id: "9", name: "habit 9" },
                        { id: "10", name: "habit 10" },
                        { id: "11", name: "habit 11" },
                        { id: "12", name: "habit 12" },
                        { id: "13", name: "habit 13" },
                        { id: "14", name: "habit 14" },
                        { id: "15", name: "habit 15" },
                        { id: "16", name: "habit 16" },
                        { id: "17", name: "habit 17" },
                        { id: "18", name: "habit 18" },
                    ]}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <Habit data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    style={styles.habitsList}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.grayLight,
    },
    header: {
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    headerContent: {
        marginVertical: 10
    },
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.background,
        paddingBottom: 20
    },
    habitsList: {
        paddingTop: 20
    },
    title: {
        fontSize: 36,
        color: colors.textDark,
        fontFamily: fonts.title
    },
    subtitle: {
        fontSize: 16,
        color: colors.textDark,
        fontFamily: fonts.complement,
        paddingVertical: 10
    },
    avatar: {
    }
})