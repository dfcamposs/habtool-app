import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    View,
    Animated,
    Alert,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';
import { RectButton, Swipeable, } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { Tracker } from './Tracker';
import { ProgressModal } from './ProgressModal';

import { deleteHabit } from '../libs/habit.storage';
import { HabitProps } from '../libs/schema.storage';
import { getHabitWeekHistory } from '../libs/habitHistory.storage';
import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface HabitComponentProps extends TouchableOpacityProps {
    data: HabitProps
}

interface TrackerListProps {
    position: number;
    checked: boolean;
}

export function Habit({ data: habit, ...rest }: HabitComponentProps) {
    const [trackerListProps, setTrackerListProps] = useState<TrackerListProps[]>();
    const [habitIsActive, setHabitIsActive] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const { handleUpdateMyHabits, myHabits, handleUpdatePercentageCheck } = useContext(HabitsContext);
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

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
            handleUpdatePercentageCheck();
        }
    }, [modalVisible]);

    function handleRemoveHabit() {
        Alert.alert(`remover hábito`, `deseja realmente remover ${habit.name}?`, [
            {
                text: 'não',
                style: 'cancel'
            },
            {
                text: 'sim',
                onPress: async () => {
                    try {
                        await deleteHabit(habit.id);

                        const habitsUpdated = myHabits.filter(item => item.id !== habit.id);
                        handleUpdateMyHabits(habitsUpdated);

                    } catch (error) {
                        Alert.alert('algo deu errado', 'não foi possível remover!');
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
            <ProgressModal data={habit} visible={modalVisible} closeModal={handleCloseModal} />

            <Swipeable
                overshootRight={false}
                renderRightActions={() => (
                    <Animated.View>
                        <View style={{ flexDirection: 'row' }}>
                            <RectButton
                                style={styles(theme).removeButton}
                                onPress={handleRemoveHabit}
                            >
                                <MaterialIcons name="delete" size={20} color={themes[theme].textSecundary} />
                            </RectButton>
                            <RectButton
                                style={styles(theme).editButton}
                                onPress={handleUpdateHabit}
                            >
                                <MaterialIcons name="edit" size={20} color={themes[theme].textSecundary} />
                            </RectButton>
                        </View>
                    </Animated.View>
                )}
            >
                <View style={styles(theme).container}>
                    <TouchableOpacity
                        style={styles(theme).touch}
                        activeOpacity={0.8}
                        onPress={handleOpenModal}
                        {...rest}
                    >
                        <Text style={[styles(theme).text, habitIsActive && { color: themes[theme].textPrimary }]}>
                            {habit.name}
                        </Text>
                    </TouchableOpacity>

                    <FlatList
                        data={trackerListProps}
                        keyExtractor={(item) => String(item.position)}
                        renderItem={({ item }) => (
                            <Tracker
                                data={{ habit: habit, position: item.position }}
                                enabled={verifyEnabledTracker(item.position)}
                                checked={verifyEnabledTracker(item.position) && item.checked}
                                color={habit.trackColor}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                        style={styles(theme).tracker}
                    />
                </View>
            </Swipeable>
        </>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        backgroundColor: themes[theme].backgroundSecundary,
        height: 100,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 10,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 10
    },
    editButton: {
        width: 60,
        height: 100,
        backgroundColor: themes[theme].gray,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 20,
        borderRadius: 10,
    },
    removeButton: {
        width: 60,
        height: 100,
        backgroundColor: themes[theme].red,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: 20,
        borderRadius: 10
    },
    text: {
        color: themes[theme].textUnfocus,
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
    }
})