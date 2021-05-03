import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import avatar from '../assets/avatar.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyHabits() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Olá, David</Text>
                        <Text style={styles.subtitle}>seja 1% melhor todos os dias</Text>
                        <View style={styles.stars}>
                            <MaterialIcons name="star" size={20} color={colors.blue} />
                            <MaterialIcons name="star" size={20} color={colors.blue} />
                            <MaterialIcons name="star" size={20} color={colors.blue} />
                            <MaterialIcons name="star" size={20} color={colors.white} />
                            <MaterialIcons name="star" size={20} color={colors.white} />
                        </View>
                    </View>
                    <Image source={avatar} style={styles.avatar} />
                </View>


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
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.background
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: colors.grayLight,
        height: 170,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    headerContent: {
    },
    title: {
        fontSize: 28,
        color: colors.textDark,
        fontFamily: fonts.title
    },
    subtitle: {
        fontSize: 12,
        color: colors.textDark,
        fontFamily: fonts.complement,
        paddingVertical: 10
    },
    stars: {
        flexDirection: 'row'
    },
    avatar: {
    }
})