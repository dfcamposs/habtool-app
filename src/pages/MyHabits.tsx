import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { RFValue } from 'react-native-responsive-fontsize';

import { Habit } from '../components/Habit';
import { Stars } from '../components/Stars';

import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

export function MyHabits() {
    const { myHabits, motivationalPhrase } = useContext(HabitsContext);
    const { userName } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    function handleOpenSettings() {
        navigation.navigate('Settings');
    }

    function getLegendDayTracker(position: number): string {
        const currentDate = new Date();
        return format(currentDate.setDate(currentDate.getDate() - position), 'E', { locale: pt }).toLocaleLowerCase();
    }

    return (
        <SafeAreaView style={styles(theme).container}>
            <View style={styles(theme).header}>
                <View style={styles(theme).headerContent}>
                    <View>
                        <Text style={styles(theme).title}>Olá, {userName}!</Text>
                        <Text style={styles(theme).subtitle}>
                            {motivationalPhrase}
                        </Text>

                        <Stars />
                    </View>
                    <TouchableOpacity activeOpacity={0.3} onPress={handleOpenSettings}>
                        <MaterialIcons
                            name="tune"
                            size={30}
                            color={themes[theme].textUnfocus}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles(theme).content}>
                {myHabits.length ?
                    <>
                        <View style={styles(theme).weekLegendContainer}>
                            <View style={styles(theme).weekLegend}>
                                <Text style={styles(theme).weekLegendText}>{getLegendDayTracker(6)}</Text>
                                <Text style={styles(theme).weekLegendText}>{getLegendDayTracker(5)}</Text>
                                <Text style={styles(theme).weekLegendText}>{getLegendDayTracker(4)}</Text>
                                <Text style={styles(theme).weekLegendText}>{getLegendDayTracker(3)}</Text>
                                <Text style={styles(theme).weekLegendText}>{getLegendDayTracker(2)}</Text>
                                <Text style={styles(theme).weekLegendText}>{getLegendDayTracker(1)}</Text>
                                <Text style={[styles(theme).weekLegendText, { fontFamily: fonts.legendBold }]}>{getLegendDayTracker(0)}</Text>
                            </View>
                        </View>
                        <View style={styles(theme).habitList}>
                            <FlatList
                                data={myHabits}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item }) => (
                                    <Habit data={item} />
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </>
                    :
                    <View style={styles(theme).habitListEmpty}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('adicionar')}>
                            <MaterialIcons name="add-circle" size={50} color={themes[theme].textUnfocus} />
                        </TouchableOpacity>
                        <Text style={styles(theme).habitListEmptyText}>Comece adicionando {'\n'} um novo hábito</Text>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: themes[theme].backgroundSecundary,
    },
    header: {
        height: 170,
        paddingHorizontal: 30,
        marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    weekLegendContainer: {
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingBottom: 15
    },
    weekLegend: {
        width: 290,
        height: 20,
        backgroundColor: themes[theme].backgroundSecundary,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekLegendText: {
        color: themes[theme].textPrimary,
        fontSize: RFValue(10),
        fontFamily: fonts.legend,
        minWidth: 30,
        marginHorizontal: 5,
        textAlign: 'center'
    },
    content: {
        flex: 1,
        backgroundColor: themes[theme].backgroundPrimary,
    },
    habitListEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    habitListEmptyText: {
        fontSize: RFValue(16),
        color: themes[theme].textUnfocus,
        fontFamily: fonts.subtitle,
        paddingTop: 10,
        textAlign: 'center'
    },
    habitList: {
        flex: 1
    },
    title: {
        fontSize: RFValue(24),
        color: themes[theme].textPrimary,
        fontFamily: fonts.title
    },
    subtitle: {
        fontSize: RFValue(13),
        color: themes[theme].textUnfocus,
        fontFamily: fonts.subtitle,
        paddingTop: 5,
        paddingBottom: 20
    }
})