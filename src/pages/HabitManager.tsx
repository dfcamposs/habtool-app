import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    Switch,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WeekDayButton } from '../components/WeekDayButton';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function HabitManager() {
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [selectedScheduleDateTime, setSelectedScheduleDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const [showStartDate, setShowStartDate] = useState(false);
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(new Date());
    const [showEndDate, setShowEndDate] = useState(false);
    const [selectedEndDateTime, setSelectedEndDateTime] = useState(new Date());

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

    function handleChangeTimeSchedule(event: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedScheduleDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro! ⏱');
        }

        if (dateTime) {
            setSelectedScheduleDateTime(dateTime);
        }
    }

    function handleChangeStartDate(event: Event, dateTime: Date | undefined) {
        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedStartDateTime(new Date());
            return Alert.alert('Escolha uma data no futuro! ⏱');
        }

        if (dateTime) {
            setSelectedStartDateTime(dateTime);
        }
    }

    function handleChangeEndDate(event: Event, dateTime: Date | undefined) {
        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedEndDateTime(new Date());
            return Alert.alert('Escolha uma data no futuro! ⏱');
        }

        if (dateTime) {
            setSelectedEndDateTime(dateTime);
        }
    }

    function handleOpenDatetimePickerScheduleForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
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
                            <Text style={styles.subtitle}>frequencia</Text>

                            <View style={styles.week}>
                                <WeekDayButton title="dom" active={sundayEnabled} onPress={() => setSundayEnabled((oldValue) => !oldValue)} />
                                <WeekDayButton title="seg" active={mondayEnabled} onPress={() => setMondayEnabled((oldValue) => !oldValue)} />
                                <WeekDayButton title="ter" active={tuesdayEnabled} onPress={() => setTuesdayEnabled((oldValue) => !oldValue)} />
                                <WeekDayButton title="qua" active={wednesdayEnabled} onPress={() => setWednesdayEnabled((oldValue) => !oldValue)} />
                                <WeekDayButton title="qui" active={thrusdayEnabled} onPress={() => setThursdayEnabled((oldValue) => !oldValue)} />
                                <WeekDayButton title="sex" active={fridayEnabled} onPress={() => setFridayEnabled((oldValue) => !oldValue)} />
                                <WeekDayButton title="sab" active={saturdayEnabled} onPress={() => setSaturdayEnabled((oldValue) => !oldValue)} />
                            </View>

                            <Input name="habitMotivation" icon="flag" placeholder="digite sua motivação" />
                            <Input
                                name="habitStartDate"
                                icon="event"
                                placeholder="selecionar data início"
                                editable={false}
                                value={format(selectedStartDateTime, "dd 'de' LLLL',' yyyy", { locale: pt })}
                                onResponderStart={() => setShowStartDate((oldvalue) => !oldvalue)}
                            />
                            {showStartDate && (
                                <DateTimePicker
                                    value={selectedStartDateTime}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChangeStartDate}
                                    style={styles.dateTimePickerIos}
                                />
                            )}

                            <Input
                                name="habitEndDate"
                                icon="event"
                                placeholder="selecionar data fim"
                                editable={false}
                                onResponderStart={() => setShowEndDate((oldvalue) => !oldvalue)}
                            />
                            {showEndDate && (
                                <DateTimePicker
                                    value={selectedEndDateTime}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChangeEndDate}
                                    style={styles.dateTimePickerIos}
                                />
                            )}

                            <View style={styles.scheduleLabel}>
                                <Text style={styles.subtitle}> lembrete </Text>
                                <Switch
                                    thumbColor={colors.white}
                                    trackColor={{ true: colors.blue, false: colors.grayLight }}
                                    ios_backgroundColor={colors.grayLight}
                                    onValueChange={changeScheduleSwitch}
                                    value={scheduleEnabled}
                                />
                            </View>

                            {scheduleEnabled && showDatePicker && (
                                <DateTimePicker
                                    value={selectedScheduleDateTime}
                                    mode="time"
                                    display="spinner"
                                    onChange={handleChangeTimeSchedule}
                                    style={styles.dateTimePickerIos}
                                />
                            )}

                            {
                                scheduleEnabled && Platform.OS === 'android' && (
                                    <TouchableOpacity
                                        style={styles.dateTimePickerButton}
                                        onPress={handleOpenDatetimePickerScheduleForAndroid}
                                    >
                                        <Text style={styles.dateTimePickerText}>
                                            {`alterar ${format(selectedScheduleDateTime, 'HH:mm')}`}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }

                            <View style={styles.footer}>
                                <Button title="cadastrar" />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScrollView>
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
    scheduleLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20
    },
    dateTimePickerIos: {
        width: '100%',
        height: 100,
        marginVertical: 10
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40
    },
    dateTimePickerText: {
        color: colors.textDark,
        fontSize: 20,
        fontFamily: fonts.content,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end'
    }
})