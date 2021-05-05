import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Switch } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Input } from '../components/Input';
import { WeekDayButton } from '../components/WeekDayButton';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function HabitManager() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    criar um hábito
                </Text>

                <Input name="habitName" placeholder="digite o nome do hábito" />
            </View>

            <View style={styles.form}>
                <Text style={styles.subtitle}>Frequencia</Text>

                <View style={styles.week}>
                    <WeekDayButton title="Dom" />
                    <WeekDayButton title="Seg" active />
                    <WeekDayButton title="Ter" active />
                    <WeekDayButton title="Qua" active />
                    <WeekDayButton title="Qui" active />
                    <WeekDayButton title="Sex" active />
                    <WeekDayButton title="Sab" />
                </View>

                <Input name="habitMotivation" placeholder="digite sua motivação" />
                <Input name="habitStartDate" placeholder="selecionar data início" />
                <Input name="habitEndDate" placeholder="selecionar data fim" />

                <View style={styles.schedule}>
                    <Text style={styles.subtitle}>Lembrete</Text>
                    <Switch
                        style={styles.switch}
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
        backgroundColor: colors.grayLight
    },
    header: {
        height: 170,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.title,
        color: colors.textDark,
        paddingBottom: 25
    },
    form: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20
    },
    subtitle: {
        fontSize: 20,
        fontFamily: fonts.content,
        color: colors.textDark,
        paddingTop: 10
    },
    week: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    schedule: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15
    },
    switch: {
        width: 20,
        height: 20,
        marginLeft: 20
    }
})