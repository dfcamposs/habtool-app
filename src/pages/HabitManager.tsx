import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Switch, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WeekDayButton } from '../components/WeekDayButton';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function HabitManager() {
    const [scheduleEnabled, setScheduleEnabled] = useState(false);

    const [sundayEnabled, setSundayEnabled] = useState(false);
    const [mondayEnabled, setMondayEnabled] = useState(true);
    const [tuesdayEnabled, setTuesdayEnabled] = useState(true);
    const [wednesdayEnabled, setWednesdayEnabled] = useState(true);
    const [thrusdayEnabled, setThursdayEnabled] = useState(true);
    const [fridayEnabled, setFridayEnabled] = useState(true);
    const [saturdayEnabled, setSaturdayEnabled] = useState(false);

    function changeScheduleSwitch() {
        setScheduleEnabled((oldValue) => !oldValue);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            criar um hábito
                        </Text>

                        <Input name="habitName" placeholder="digite o nome do hábito" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.form}>
                        <Text style={styles.subtitle}>Frequencia</Text>

                        <View style={styles.week}>
                            <WeekDayButton title="Dom" active={sundayEnabled} onPress={() => setSundayEnabled((oldValue) => !oldValue)} />
                            <WeekDayButton title="Seg" active={mondayEnabled} onPress={() => setMondayEnabled((oldValue) => !oldValue)} />
                            <WeekDayButton title="Ter" active={tuesdayEnabled} onPress={() => setTuesdayEnabled((oldValue) => !oldValue)} />
                            <WeekDayButton title="Qua" active={wednesdayEnabled} onPress={() => setWednesdayEnabled((oldValue) => !oldValue)} />
                            <WeekDayButton title="Qui" active={thrusdayEnabled} onPress={() => setThursdayEnabled((oldValue) => !oldValue)} />
                            <WeekDayButton title="Sex" active={fridayEnabled} onPress={() => setFridayEnabled((oldValue) => !oldValue)} />
                            <WeekDayButton title="Sab" active={saturdayEnabled} onPress={() => setSaturdayEnabled((oldValue) => !oldValue)} />
                        </View>

                        <Input name="habitMotivation" placeholder="digite sua motivação" />
                        <Input name="habitStartDate" placeholder="selecionar data início" />
                        <Input name="habitEndDate" placeholder="selecionar data fim" />

                        <View style={styles.schedule}>
                            <Text style={styles.subtitle}> Lembrete </Text>
                            <Switch
                                thumbColor={colors.white}
                                trackColor={{ true: colors.blue, false: colors.grayLight }}
                                ios_backgroundColor={colors.grayLight}
                                onValueChange={changeScheduleSwitch}
                                value={scheduleEnabled}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Button title="cadastrar" />
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
        paddingRight: 20
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
        paddingTop: 20
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end'
    }
})