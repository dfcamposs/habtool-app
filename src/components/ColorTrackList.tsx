import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { ThemeContext } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import themes from '../styles/themes';


export enum ColorEnum {
    default = '#00d95a',
    blue = '#00bbff',
    orange = '#ff9843',
    pink = '#ff5084',
    purple = '#745fff',
    red = '#ff4436',
    yellow = '#ffcb49'
}

interface ColorTrackListProps {
    colorSelected: ColorEnum,
    handleColorChange: (color: ColorEnum) => void;
}

export function ColorTrackList({ colorSelected, handleColorChange }: ColorTrackListProps) {
    const { isPro } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const colors = [
        ColorEnum.default,
        ColorEnum.blue,
        ColorEnum.orange,
        ColorEnum.pink,
        ColorEnum.purple,
        ColorEnum.red,
        ColorEnum.yellow
    ];

    function handleOpenProPage() {
        navigation.navigate('ProPurchase');
    }

    return (
        <View style={styles(theme).container}>
            <FlatList
                data={colors}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <View style={styles(theme).tracker}>
                        <TouchableOpacity
                            activeOpacity={.7}
                            style={[
                                styles(theme).color,
                                { backgroundColor: item }
                            ]}
                            onPress={isPro ? () => handleColorChange(item) : handleOpenProPage}
                        >
                            {colorSelected === item &&
                                <MaterialIcons
                                    name="check"
                                    size={20}
                                    color={themes[theme].textSecundary} />
                            }
                        </TouchableOpacity>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = (theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10
    },
    tracker: {
        alignItems: 'center',
        paddingRight: 10
    },
    color: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})