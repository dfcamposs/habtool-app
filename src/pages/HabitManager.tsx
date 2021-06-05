import React, { useContext, useEffect, useState } from 'react';
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
import { v4 as uuid } from 'uuid';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WeekDayButton } from '../components/WeekDayButton';
import { DateButton } from '../components/DateButton';

import { getHabitByName, HabitProps, saveHabit } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
    habit?: HabitProps
}

export function HabitManager() {
    const { myHabits, handleUpdateMyHabits } = useContext(HabitsContext);
    const [habitName, setHabitName] = useState<string>();
    const [habitMotivation, setHabitMotivation] = useState<string>();
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [selectedScheduleDateTime, setSelectedScheduleDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const [showStartDate, setShowStartDate] = useState(false);
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(new Date());
    const [showEndDate, setShowEndDate] = useState(false);
    const [selectedEndDateTime, setSelectedEndDateTime] = useState<Date>();

    const [sundayEnabled, setSundayEnabled] = useState(false);
    const [mondayEnabled, setMondayEnabled] = useState(true);
    const [tuesdayEnabled, setTuesdayEnabled] = useState(true);
    const [wednesdayEnabled, setWednesdayEnabled] = useState(true);
    const [thrusdayEnabled, setThursdayEnabled] = useState(true);
    const [fridayEnabled, setFridayEnabled] = useState(true);
    const [saturdayEnabled, setSaturdayEnabled] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { habit } = route.params as Params;

    useEffect(() => {
        if (habit) {
            setHabitName(habit.name);
            setHabitMotivation(habit.motivation);
            setSundayEnabled(habit.frequency["sun"]);
            setMondayEnabled(habit.frequency["mon"]);
            setTuesdayEnabled(habit.frequency["tue"]);
            setWednesdayEnabled(habit.frequency["wed"]);
            setThursdayEnabled(habit.frequency["thu"]);
            setFridayEnabled(habit.frequency["fri"]);
            setSaturdayEnabled(habit.frequency["sat"]);
            setSelectedStartDateTime(new Date(habit.startDate));
            setSelectedEndDateTime(habit.endDate ? new Date(habit.endDate) : undefined);
            setSelectedScheduleDateTime(!!habit.notificationHour ? new Date(habit.notificationHour) : new Date());
            setScheduleEnabled(!!habit.notificationHour);
            setShowDatePicker(false);
        }
    }, [habit]);

    function changeScheduleSwitch(): void {
        setScheduleEnabled((oldValue) => !oldValue);
    }

    function handleChangeTimeSchedule(event: Event, dateTime: Date | undefined): void {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime) {
            setSelectedScheduleDateTime(dateTime);
        }
    }

    function handleChangeStartDate(event: Event, dateTime: Date | undefined): void {
        if (Platform.OS === 'android') {
            setShowStartDate(oldState => !oldState);
        }

        if (dateTime) {
            setSelectedStartDateTime(dateTime);
        }
    }

    function handleChangeEndDate(event: Event, dateTime: Date | undefined): void {
        if (Platform.OS === 'android') {
            setShowEndDate(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, selectedStartDateTime)) {
            setSelectedEndDateTime(selectedStartDateTime);
            return Alert.alert('Escolha uma data maior que a de início! 📅')
        }

        if (dateTime) {
            setSelectedEndDateTime(dateTime);
        }
    }

    function handleOpenDatetimePickerScheduleForAndroid(): void {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSaveHabit(): Promise<void> {
        try {

            if (!habitName) {
                return Alert.alert('Não é possível criar um hábito sem nome!');
            }

            const verifyHabitExists = await getHabitByName(habitName);

            if (verifyHabitExists && (habit && verifyHabitExists.id !== habit.id)) {
                return Alert.alert('Hábito com este nome já cadastrado!');
            }

            const newHabit: HabitProps = {
                id: habit?.id ?? uuid(),
                name: habitName,
                motivation: habitMotivation,
                frequency: {
                    sun: sundayEnabled,
                    mon: mondayEnabled,
                    tue: tuesdayEnabled,
                    wed: wednesdayEnabled,
                    thu: thrusdayEnabled,
                    fri: fridayEnabled,
                    sat: saturdayEnabled
                },
                startDate: selectedStartDateTime.getTime(),
                endDate: selectedEndDateTime?.getTime(),
                notificationHour: scheduleEnabled ? selectedScheduleDateTime.getTime() : undefined,
                order: habit?.order ?? 0
            }

            await saveHabit(newHabit);

            let habitsUpdated = habit
                ? [{ ...newHabit }, ...myHabits.filter(item => item.id !== habit.id)]
                : [{ ...newHabit }, ...myHabits]

            handleUpdateMyHabits(habitsUpdated.sort((a, b) => a.order - b.order));
            navigation.navigate('Confirmation');

        } catch {
            Alert.alert('Não foi possível salvar!');
        }
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

                        <Input
                            name="habitName"
                            icon="loop"
                            placeholder="digite o nome do hábito"
                            defaultValue={habitName}
                            onChangeText={(text: string) => setHabitName(text)}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.form}
                    >
                        <View>
                            <Text style={styles.subtitle}>frequencia</Text>

                            <View style={styles.week}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <WeekDayButton title="dom" active={sundayEnabled} onPress={() => setSundayEnabled((oldValue) => !oldValue)} />
                                    <WeekDayButton title="seg" active={mondayEnabled} onPress={() => setMondayEnabled((oldValue) => !oldValue)} />
                                    <WeekDayButton title="ter" active={tuesdayEnabled} onPress={() => setTuesdayEnabled((oldValue) => !oldValue)} />
                                    <WeekDayButton title="qua" active={wednesdayEnabled} onPress={() => setWednesdayEnabled((oldValue) => !oldValue)} />
                                    <WeekDayButton title="qui" active={thrusdayEnabled} onPress={() => setThursdayEnabled((oldValue) => !oldValue)} />
                                    <WeekDayButton title="sex" active={fridayEnabled} onPress={() => setFridayEnabled((oldValue) => !oldValue)} />
                                    <WeekDayButton title="sab" active={saturdayEnabled} onPress={() => setSaturdayEnabled((oldValue) => !oldValue)} />
                                </ScrollView>
                            </View>

                            <Input
                                name="habitMotivation"
                                icon="flag"
                                placeholder="digite sua motivação"
                                defaultValue={habitMotivation}
                                onChangeText={(text: string) => setHabitMotivation(text)}
                            />

                            <DateButton
                                name="habitStartDate"
                                date={format(selectedStartDateTime, "dd 'de' LLLL',' yyyy", { locale: pt })}
                                onPress={() => setShowStartDate((oldValue) => !oldValue)}
                            />
                            {showStartDate && (
                                <DateTimePicker
                                    value={selectedStartDateTime}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChangeStartDate}
                                    style={styles.dateTimePickerIos}
                                    textColor={colors.textPrimary}
                                />
                            )}

                            <DateButton
                                name="habitStartDate"
                                date={selectedEndDateTime && format(selectedEndDateTime, "dd 'de' LLLL',' yyyy", { locale: pt })}
                                onPress={() => setShowEndDate((oldValue) => !oldValue)}
                                clear={() => setSelectedEndDateTime(undefined)}
                            />
                            {showEndDate && (
                                <DateTimePicker
                                    value={selectedEndDateTime ?? new Date()}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChangeEndDate}
                                    style={styles.dateTimePickerIos}
                                    textColor={colors.textPrimary}
                                />
                            )}

                            <View style={styles.scheduleLabel}>
                                <Text style={styles.subtitle}> lembrete </Text>
                                <Switch
                                    thumbColor={colors.backgroundPrimary}
                                    trackColor={{ true: colors.blue, false: colors.backgroundSecundary }}
                                    ios_backgroundColor={colors.backgroundSecundary}
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
                                    textColor={colors.textPrimary}
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
                        </View>
                        <View style={styles.footer}>
                            <Button title="salvar" onPress={handleSaveHabit} />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.backgroundSecundary
    },
    header: {
        height: 160,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    title: {
        fontSize: 20,
        fontFamily: fonts.title,
        color: colors.textPrimary,
        paddingBottom: 25
    },
    form: {
        flexGrow: 1,
        backgroundColor: colors.backgroundPrimary,
        padding: 20,
        justifyContent: 'space-between'
    },
    subtitle: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: colors.textPrimary,
        paddingRight: 20
    },
    week: {
        paddingTop: 15,
        paddingBottom: 5
    },
    scheduleLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20
    },
    dateTimePickerIos: {
        width: '100%',
        height: 100,
        marginVertical: 10,
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 30
    },
    dateTimePickerText: {
        color: colors.textPrimary,
        fontSize: 15,
        fontFamily: fonts.content,
    },
    footer: {
        paddingTop: 10
    }
})