import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, Animated, Alert, TouchableOpacity, TouchableOpacityProps, Modal, TouchableHighlight, Platform } from 'react-native';
import { RectButton, Swipeable, } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Tracker } from './Tracker';
import { HabitCalendar } from './HabitCalendar';

import { deleteHabit, FrequencyProps, getHabitWeekHistory } from '../libs/storage';
import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HabitProps extends TouchableOpacityProps {
    data: {
        id: string;
        name: string,
        frequency: FrequencyProps,
        endDate?: number;
    }
}

interface TrackerListProps {
    position: number;
    checked: boolean;
}

export function Habit({ data: habit, ...rest }: HabitProps) {
    const [trackerListProps, setTrackerListProps] = useState<TrackerListProps[]>();
    const [habitIsActive, setHabitIsActive] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const { handleUpdateMyHabits, myHabits } = useContext(HabitsContext);
    const navigation = useNavigation();

    async function getWeekHistory() {
        const initialTrackerList: TrackerListProps[] = [
            { position: 6, checked: false },
            { position: 5, checked: false },
            { position: 4, checked: false },
            { position: 3, checked: false },
            { position: 2, checked: false },
            { position: 1, checked: false },
            { position: 0, checked: false },
        ]

        const history = await getHabitWeekHistory(habit.id);

        const historyFormatted = history.map((item: number) => format(item, 'dd-MM-yyyy'));

        for (const item of initialTrackerList) {
            const currentDate = new Date();
            const date = format(currentDate.setDate(currentDate.getDate() - item.position), 'dd-MM-yyyy');

            if (historyFormatted.includes(date)) {
                item.checked = true
            }
        }

        setTrackerListProps(initialTrackerList);
    };

    useEffect(() => {
        function verifyEndDate() {
            if (habit.endDate && habit.endDate < Date.now())
                setHabitIsActive(false);
        }

        getWeekHistory();
        verifyEndDate();
    }, []);

    useEffect(() => {
        if (!modalVisible) {
            setTrackerListProps([]);
            getWeekHistory();
        }
    }, [modalVisible]);

    function handleRemoveHabit() {
        Alert.alert('Remover', `Deseja remover a ${habit.name}?`, [
            {
                text: 'Não 🙏🏼',
                style: 'cancel'
            },
            {
                text: 'Sim 😢',
                onPress: async () => {
                    try {
                        await deleteHabit(habit.id);

                        const habitsUpdated = myHabits.filter(item => item.id !== habit.id);
                        handleUpdateMyHabits(habitsUpdated);

                    } catch (error) {
                        Alert.alert('Não foi possível remover! 😢');
                    }
                }
            }
        ])
    }

    function handleUpdateHabit() {
        navigation.navigate('EditHabit', { habit })
    }

    function verifyEnabledTracker(position: number): boolean {
        if (!habitIsActive) {
            return false;
        }

        const currentDate = new Date();
        const weekDay = format(currentDate.setDate(currentDate.getDate() - position), 'E').toLocaleLowerCase();
        return habit.frequency[weekDay];
    }

    function handleOpenModal() {
        setModalVisible(true);
    }

    function handleCloseModal() {
        setModalVisible(false);
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{habit.name}</Text>

                    <View style={styles.calendar}>
                        <Text style={styles.subtitle}>histórico</Text>
                        <HabitCalendar habitId={habit.id} />
                    </View>
                    <RectButton style={styles.button} onPress={handleCloseModal}>
                        <Text style={styles.textButton}>voltar</Text>
                    </RectButton>
                </View>
            </Modal>

            <Swipeable
                overshootRight={false}
                renderRightActions={() => (
                    <Animated.View>
                        <View style={{ flexDirection: 'row' }}>
                            <RectButton
                                style={styles.removeButton}
                                onPress={handleRemoveHabit}
                            >
                                <MaterialIcons name="delete" size={20} color={colors.textSecundary} />
                            </RectButton>
                            <RectButton
                                style={styles.editButton}
                                onPress={handleUpdateHabit}
                            >
                                <MaterialIcons name="edit" size={20} color={colors.textSecundary} />
                            </RectButton>
                        </View>
                    </Animated.View>
                )}
            >
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.touch}
                        activeOpacity={0.8}
                        onPress={handleOpenModal}
                        {...rest}
                    >
                        <Text style={[styles.text, habitIsActive && { color: colors.textPrimary }]}>
                            {habit.name}
                        </Text>
                    </TouchableOpacity>

                    <FlatList
                        data={trackerListProps}
                        keyExtractor={(item) => String(item.position)}
                        renderItem={({ item }) => (
                            <Tracker
                                data={{ habitId: habit.id, position: item.position }}
                                enabled={verifyEnabledTracker(item.position)}
                                checked={verifyEnabledTracker(item.position) && item.checked}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                        style={styles.tracker}
                    />
                </View>
            </Swipeable>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundSecundary,
        height: 100,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 10,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 10,
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    editButton: {
        width: 60,
        height: 100,
        backgroundColor: colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 20,
        borderRadius: 10,
    },
    removeButton: {
        width: 60,
        height: 100,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 20,
        borderRadius: 10
    },
    text: {
        color: colors.textUnfocus,
        fontFamily: fonts.content,
        fontSize: 16
    },
    tracker: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 10
    },
    touch: {
        flex: 1
    },

    //Modal
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: getStatusBarHeight(),
        paddingVertical: 23,
        paddingHorizontal: 10,
        backgroundColor: colors.backgroundPrimary
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: fonts.title,
        color: colors.textPrimary,
        paddingVertical: 40
    },
    calendar: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.backgroundPrimary
    },
    subtitle: {
        fontSize: 18,
        fontFamily: fonts.subtitle,
        color: colors.textUnfocus,
        paddingLeft: 20,
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: colors.backgroundSecundary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    textButton: {
        fontSize: 16,
        fontFamily: fonts.contentBold,
        color: colors.textPrimary
    },
})