import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { HabitsContext } from '../context/habits';

import colors from '../styles/colors';

export function Stars() {
    const { percentageChecked } = useContext(HabitsContext);

    function handleCheckStar(minPercentage: number): string {
        if (percentageChecked >= minPercentage) {
            return colors.blue;
        }

        return colors.white;
    }

    return (
        <View style={styles.container}>
            <MaterialIcons style={styles.star} name="star" size={30} color={handleCheckStar(10)} />
            <MaterialIcons style={styles.star} name="star" size={30} color={handleCheckStar(30)} />
            <MaterialIcons style={styles.star} name="star" size={30} color={handleCheckStar(50)} />
            <MaterialIcons style={styles.star} name="star" size={30} color={handleCheckStar(80)} />
            <MaterialIcons style={styles.star} name="star" size={30} color={handleCheckStar(100)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    star: {
        marginRight: 5
    }
})

