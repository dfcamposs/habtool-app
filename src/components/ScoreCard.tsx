import React, { useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';
import fonts from '../styles/fonts';

interface ScoreCardProps {
    score: string;
    legend: string;
    isLoading?: boolean;
    color?: string;
}

export function ScoreCard({ score, legend, isLoading = false, color }: ScoreCardProps) {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles(theme).container, !!color && { backgroundColor: color }]}>
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
        width: 115,
        height: 70,
        backgroundColor: themes[theme].backgroundPrimary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        marginRight: 10
    },
    score: {
        fontSize: RFValue(24),
        color: themes[theme].textPrimary,
        fontFamily: fonts.content,
        textAlign: 'center',
    },
    legend: {
        fontSize: RFValue(10),
        color: themes[theme].textUnfocus,
        fontFamily: fonts.legend,
        textAlign: 'center'
    },
})