import React, { useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface ScoreCardProps {
    score: number;
    legend: string;
    isLoading: boolean;
}

export function ScoreCard({ score, legend, isLoading }: ScoreCardProps) {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={styles(theme).container}>
            {isLoading ?
                <ActivityIndicator
                    color={themes[theme].textPrimary}
                />
                :
                <>
                    <Text style={styles(theme).score}>{score}</Text>
                    <Text style={styles(theme).legend}>{legend}</Text>
                </>
            }
        </View>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        width: 120,
        height: 70,
        backgroundColor: themes[theme].backgroundPrimary,
        borderRadius: 10,
        marginHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    score: {
        fontSize: 24,
        color: themes[theme].textPrimary,
        fontFamily: fonts.content,
        textAlign: 'center',
        lineHeight: 30
    },
    legend: {
        fontSize: 10,
        color: themes[theme].textUnfocus,
        fontFamily: fonts.legend,
        textAlign: 'center'
    },
})