import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

import { Habit } from '../components/Habit';
import { Stars } from '../components/Stars';
import { HabitsContext } from '../context/habits';
import { HabitProps } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyHabits() {
    const { myHabits, userName } = useContext(HabitsContext);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Olá, {userName}</Text>
                <Text style={styles.subtitle}>seja 1% melhor todos os dias</Text>

                <Stars />
            </View>
            <View style={styles.content}>
                <View style={styles.habitsList}>
                    <FlatList
                        data={myHabits}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <Habit data={item} />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
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
        flex: 1,
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