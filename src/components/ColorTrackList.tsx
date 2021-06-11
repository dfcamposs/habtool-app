import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { ThemeContext } from '../contexts/themes';
import { UserContext } from '../contexts/user';

import themes from '../styles/themes';


export enum ColorEnum {
    default = '#00D95A',
    blue = '#264653',
    green = '#2a9d8f',
    yellow = '#e9c46a',
    orange = '#f4a261',
    red = '#e76f51'
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
        ColorEnum.green,
        ColorEnum.yellow,
        ColorEnum.orange,
        ColorEnum.red,
    ];

    function handleOpenProPage() {
        //to-do enviar para pagina para adquirir pro
        //navigation.navigate();
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
        alignItems: 'center',
        paddingVertical: 20
    },
    tracker: {
        alignItems: 'center',
        paddingHorizontal: 10
    },
    color: {
        height: 40,
        width: 40,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    }
})