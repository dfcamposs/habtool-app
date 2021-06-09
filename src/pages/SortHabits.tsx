import React, { useContext, useState } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { DragEndParams } from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { isBefore } from 'date-fns';

import { Button } from '../components/Button';

import { HabitsContext } from '../context/habits';
import { ThemeContext } from '../context/themes';
import { HabitProps, StorageHabitSortProps, updateHabitsSort } from '../libs/storage';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

export function SortHabits() {
    const { myHabits, handleUpdateMyHabits } = useContext(HabitsContext);
    const [habitsSorted, setHabitsSorted] = useState<HabitProps[]>(myHabits);
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    async function handleDragEnd({ data }: DragEndParams<HabitProps>) {
        setHabitsSorted(data);
    }

    async function handleSaveHabitListSorted() {
        let saveHabitsSorted: StorageHabitSortProps = {};

        habitsSorted.forEach((habit, index) => {
            saveHabitsSorted = { ...saveHabitsSorted, [habit.id]: index + 1 }
            habit.order = index + 1
        });

        handleUpdateMyHabits(habitsSorted);
        await updateHabitsSort(saveHabitsSorted);
        navigation.navigate('MyHabits');
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <Text style={styles(theme).title}>ordenar hábitos</Text>
            <View style={styles(theme).habitList}>
                <DraggableFlatList
                    data={habitsSorted}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item: habit, drag }) => (
                        <TouchableOpacity
                            style={styles(theme).habit}
                            activeOpacity={0.7}
                            onLongPress={drag}
                        >
                            <MaterialIcons
                                name="drag-indicator"
                                size={25}
                                color={themes[theme].textUnfocus}
                            />
                            <Text
                                style={[
                                    styles(theme).habitName,
                                    (habit.endDate !== undefined
                                        && isBefore(Number(habit.endDate), Date.now()))
                                    && { color: themes[theme].textUnfocus }
                                ]}
                            >
                                {habit.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    onDragEnd={(data) => handleDragEnd(data)}
                />
            </View>
            <View style={styles(theme).footer}>
                <Button title="salvar" onPress={handleSaveHabitListSorted} />
            </View>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    title: {
        fontSize: 20,
        fontFamily: fonts.title,
        color: themes[theme].textPrimary,
        paddingTop: 20
    },
    habitList: {
        flex: 1,
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    habit: {
        backgroundColor: themes[theme].backgroundSecundary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10
    },
    habitName: {
        fontSize: 16,
        fontFamily: fonts.content,
        color: themes[theme].textPrimary,
        paddingLeft: 10
    },
    footer: {
        width: '100%',
        padding: 20
    }
})