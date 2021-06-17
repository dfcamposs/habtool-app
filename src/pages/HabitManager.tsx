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
    TouchableOpacity,
    FlatList
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { v4 as uuid } from 'uuid';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WeekDayButton } from '../components/WeekDayButton';
import { DateButton } from '../components/DateButton';
import { ColorEnum, ColorTrackList } from '../components/ColorTrackList';

import { getHabitByName, HabitProps, saveHabit } from '../libs/storage';
import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface Params {
    habit?: HabitProps
}

export function HabitManager() {
    const { myHabits, handleUpdateMyHabits } = useContext(HabitsContext);
    const [habitName, setHabitName] = useState<string>();
    const [habitMotivation, setHabitMotivation] = useState<string>();
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [selectedScheduleDateTime, setSelectedScheduleDateTime] = useState<Date[]>([new Date(), new Date(2021, 3, 12), new Date(2021, 4, 16)]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartDate, setShowStartDate] = useState(false);
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(new Date());
    const [showEndDate, setShowEndDate] = useState(false);
    const [selectedEndDateTime, setSelectedEndDateTime] = useState<Date>();

    const [colorSelected, setColorSelected] = useState<ColorEnum>(ColorEnum.default);

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
    const { theme } = useContext(ThemeContext);

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
            setSelectedScheduleDateTime(habit.notificationHours.map(hour => new Date(hour)));
            setScheduleEnabled(!!habit.notificationHours.length);
            setColorSelected(habit.trackColor ?? ColorEnum.default)
        }
    }, [habit]);

    function changeScheduleSwitch(): void {
        setScheduleEnabled((oldValue) => !oldValue);
    }

    function handleDeleteSchedule(schedule: Date) {
        setSelectedScheduleDateTime(oldState => oldState.filter(item => item !== schedule))
    }

    function handleAddTimeSchedule(dateTime: Date): void {
        setSelectedScheduleDateTime(oldState => [...oldState, dateTime]);
        setShowDatePicker(false);
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

    async function handleSaveHabit(): Promise<void> {
        try {
            if (!habitName) {
                return Alert.alert('Não é possível criar um hábito sem nome!');
            }

            const verifyHabitExists = await getHabitByName(habitName.trim());

            if (verifyHabitExists && !(habit && (verifyHabitExists.id === habit.id))) {
                return Alert.alert('Hábito com este nome já cadastrado!');
            }

            const newHabit: HabitProps = {
                id: habit?.id ?? uuid(),
                name: habitName.trim(),
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
                notificationHours: selectedScheduleDateTime ? selectedScheduleDateTime.map(schedule => schedule.getTime()) : [],
                order: habit?.order ?? 0,
                trackColor: colorSelected !== ColorEnum.default ? colorSelected : undefined
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
        <SafeAreaView style={styles(theme).container}>
            <KeyboardAvoidingView
                style={styles(theme).container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles(theme).header}>
                        <Text style={styles(theme).title}>
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
                        contentContainerStyle={styles(theme).form}
                    >
                        <View>
                            <Text style={styles(theme).subtitle}>frequencia</Text>

                            <View style={styles(theme).week}>
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <DateButton
                                    name="habitStartDate"
                                    date={format(selectedStartDateTime, "dd 'de' LLLL',' yyyy", { locale: pt })}
                                    onPress={() => setShowStartDate((oldValue) => !oldValue)}
                                />
                                {showStartDate && (
                                    <DateTimePicker
                                        value={selectedStartDateTime}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleChangeStartDate}
                                        style={styles(theme).dateTimePickerIos}
                                        textColor={themes[theme].textPrimary}
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
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleChangeEndDate}
                                        style={styles(theme).dateTimePickerIos}
                                        textColor={themes[theme].textPrimary}
                                    />
                                )}
                            </View>
                            <View style={{ paddingTop: 10 }}>
                                <Text style={styles(theme).subtitle}>cor</Text>
                                <ColorTrackList colorSelected={colorSelected} handleColorChange={setColorSelected} />
                            </View>

                            <View style={styles(theme).scheduleLabel}>
                                <Text style={styles(theme).subtitle}> lembrete </Text>
                                <Switch
                                    thumbColor={themes[theme].textSecundary}
                                    trackColor={{ true: themes[theme].blue, false: themes[theme].backgroundSecundary }}
                                    ios_backgroundColor={themes[theme].backgroundSecundary}
                                    onValueChange={changeScheduleSwitch}
                                    value={scheduleEnabled}
                                />
                            </View>

                            {scheduleEnabled &&
                                <View style={styles(theme).scheduleContainer}>
                                    {selectedScheduleDateTime.length ?
                                        <FlatList
                                            data={selectedScheduleDateTime}
                                            keyExtractor={(item) => String(item)}
                                            renderItem={({ item }) => (
                                                <View style={styles(theme).scheduleCard}>
                                                    <Text style={styles(theme).dateTimePickerText}>
                                                        {format(item, 'HH:mm')}
                                                    </Text>
                                                    <TouchableOpacity onPress={() => handleDeleteSchedule(item)}>
                                                        <MaterialIcons name="clear" size={16} color={themes[theme].textPrimary} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            showsHorizontalScrollIndicator={false}
                                            horizontal
                                        />
                                        : <Text style={styles(theme).scheduleLegend}>adicione um horário</Text>}
                                    <TouchableOpacity style={styles(theme).addScheduleButton} onPress={() => setShowDatePicker(true)}>
                                        <MaterialIcons name="add" size={20} color={themes[theme].textPrimary} />
                                    </TouchableOpacity>
                                </View>
                            }

                            <DateTimePickerModal
                                isVisible={scheduleEnabled && showDatePicker}
                                mode="time"
                                onConfirm={handleAddTimeSchedule}
                                onCancel={() => setShowDatePicker(false)}
                                style={styles(theme).dateTimePickerIos}
                                textColor={themes[theme].textPrimary}
                                cancelTextIOS="cancelar"
                                confirmTextIOS="confirmar"
                            />

                        </View>
                        <View style={styles(theme).footer}>
                            <Button title="salvar" onPress={handleSaveHabit} />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: themes[theme].backgroundSecundary
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
        color: themes[theme].textPrimary,
        paddingBottom: 25
    },
    form: {
        flexGrow: 1,
        backgroundColor: themes[theme].backgroundPrimary,
        padding: 20,
        justifyContent: 'space-between'
    },
    subtitle: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary,
        paddingRight: 20
    },
    week: {
        paddingTop: 15,
        paddingBottom: 5
    },
    scheduleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    scheduleLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20
    },
    addScheduleButton: {
        padding: 10,
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 50
    },
    scheduleLegend: {
        fontSize: 13,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary,
        paddingRight: 10
    },
    dateTimePickerIos: {
        width: '100%',
        height: 100,
        marginVertical: 10,
    },
    scheduleCard: {
        flexDirection: 'row',
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: themes[theme].backgroundSecundary,
        borderRadius: 10,
        marginRight: 10,
        paddingHorizontal: 15
    },
    dateTimePickerText: {
        color: themes[theme].textPrimary,
        fontSize: 15,
        fontFamily: fonts.content,
    },
    footer: {
        paddingTop: 10
    }
})