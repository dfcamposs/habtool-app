import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { Habit } from '../components/Habit';
import { Stars } from '../components/Stars';
import { HabitsContext } from '../context/habits';
import { getUserName } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyHabits() {
    const [userName, setUserName] = useState<string>();
    const { myHabits } = useContext(HabitsContext);

    const navigation = useNavigation();

    useEffect(() => {
        async function verifyUserName() {
            const user = await getUserName();
            setUserName(user);
        }

        verifyUserName();
    }, []);

    function handleOpenSettings() {
        navigation.navigate('Settings');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.title}>Olá, {userName}!</Text>
                        <Text style={styles.subtitle}>seja 1% melhor todos os dias</Text>

                        <Stars />
                    </View>
                    <TouchableOpacity activeOpacity={0.3} onPress={handleOpenSettings}>
                        <MaterialIcons
                            name="tune"
                            size={30}
                            color={colors.textUnfocus}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                {myHabits.length ?
                    <FlatList
                        data={myHabits}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <Habit data={item} />
                        )}
                        showsVerticalScrollIndicator={false}
                        style={styles.habitList}
                    />
                    :
                    <View style={styles.habitListEmpty}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('adicionar')}>
                            <MaterialIcons name="add-circle" size={50} color={colors.textUnfocus} />
                        </TouchableOpacity>
                        <Text style={styles.habitListEmptyText}>Comece adicionando {'\n'} um novo hábito</Text>
                    </View>
                }
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
        paddingHorizontal: 30,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        justifyContent: 'center'
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    content: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: 20
    },
    habitListEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    habitListEmptyText: {
        fontSize: 16,
        color: colors.textUnfocus,
        fontFamily: fonts.subtitle,
        paddingTop: 10,
        textAlign: 'center'
    },
    habitList: {
        flex: 1,
        paddingTop: 20
    },
    title: {
        fontSize: 28,
        color: colors.textDark,
        fontFamily: fonts.title
    },
    subtitle: {
        fontSize: 16,
        color: colors.textDark,
        fontFamily: fonts.subtitle,
        paddingVertical: 10,
    }
})