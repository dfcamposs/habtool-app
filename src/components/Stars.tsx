import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { HabitsContext } from '../contexts/habits';
import { ThemeContext } from '../contexts/themes';

import themes from '../styles/themes';

export function Stars() {
    const { percentageChecked } = useContext(HabitsContext);
    const { theme } = useContext(ThemeContext);

    function handleCheckStar(minPercentage: number): string {
        if (percentageChecked >= minPercentage) {
            return themes[theme].blue;
        }

        return themes[theme].backgroundPrimary;
    }

    return (
        <View style={styles(theme).container}>
            <MaterialIcons style={styles(theme).star} name="star" size={25} color={handleCheckStar(20)} />
            <MaterialIcons style={styles(theme).star} name="star" size={25} color={handleCheckStar(40)} />
            <MaterialIcons style={styles(theme).star} name="star" size={25} color={handleCheckStar(60)} />
            <MaterialIcons style={styles(theme).star} name="star" size={25} color={handleCheckStar(80)} />
            <MaterialIcons style={styles(theme).star} name="star" size={25} color={handleCheckStar(100)} />
        </View>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    star: {
        marginRight: 5
    }
})

