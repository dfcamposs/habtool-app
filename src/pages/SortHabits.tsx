import React, { useContext, useState } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { DragEndParams } from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { HabitsContext } from '../context/habits';
import { HabitProps, StorageHabitSortProps, updateHabitsSorted } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/Button';

export function SortHabits() {
    const { myHabits, handleUpdateMyHabits } = useContext(HabitsContext);
    const [habitsSorted, setHabitsSorted] = useState<HabitProps[]>(myHabits);
    const navigation = useNavigation();

    async function handleDragEnd({ data }: DragEndParams<HabitProps>) {
        setHabitsSorted(data);
    }

    async function handleSaveHabitListSorted() {
        let saveHabitsSorted: StorageHabitSortProps = {};

        habitsSorted.forEach((habit, index) => {
            saveHabitsSorted = { ...saveHabitsSorted, [habit.id]: index + 1 }
        });

        handleUpdateMyHabits(habitsSorted);
        await updateHabitsSorted(saveHabitsSorted);
        navigation.navigate('MyHabits');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>ordenar hábitos</Text>
            <View style={styles.habitList}>
                <DraggableFlatList
                    data={habitsSorted}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item: habit, drag }) => (
                        <TouchableOpacity
                            style={styles.habit}
                            activeOpacity={0.7}
                            onLongPress={drag}
                        >
                            <MaterialIcons
                                name="drag-indicator"
                                size={25}
                                color={colors.textUnfocus}
                            />
                            <Text
                                style={[
                                    styles.habitName,
                                    habit.endDate !== undefined && { color: colors.textUnfocus }
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
            <View style={styles.footer}>
                <Button title="salvar" onPress={handleSaveHabitListSorted} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    title: {
        fontSize: 20,
        fontFamily: fonts.title,
        color: colors.textPrimary,
        paddingTop: 20
    },
    habitList: {
        flex: 1,
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    habit: {
        backgroundColor: colors.backgroundSecundary,
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
        color: colors.textPrimary,
        paddingLeft: 10
    },
    footer: {
        width: '100%',
        padding: 20
    }
})