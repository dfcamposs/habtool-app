import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../styles/colors';

export function Stars() {
    return (
        <View style={styles.container}>
            <MaterialIcons style={styles.star} name="star" size={28} color={colors.blue} />
            <MaterialIcons style={styles.star} name="star" size={28} color={colors.blue} />
            <MaterialIcons style={styles.star} name="star" size={28} color={colors.blue} />
            <MaterialIcons style={styles.star} name="star" size={28} color={colors.white} />
            <MaterialIcons style={styles.star} name="star" size={28} color={colors.white} />
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

