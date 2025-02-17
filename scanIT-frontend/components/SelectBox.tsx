import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/assets/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type SelectBoxProps = {
    title?: string;
    options: string[];
    style?: object;
}

const SelectBox: React.FC<SelectBoxProps> = ({title, options, style}) => {
    const [showOptions, setShowOptions] = useState(false);

    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    return (
        <View style={[styles.mainContainer, style]}>
            <View style={styles.title}>
                <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={handleShowOptions}>
                    { title ? <Text>{title}</Text> : <Text>Select</Text> }
                    <MaterialCommunityIcons name="chevron-down" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
            { showOptions &&
                <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <TouchableOpacity style={styles.optionContainer} key={index}>
                            <View style={{alignContent: 'center', justifyContent: 'center'}}>
                                <Text>{option}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.third,
    },
    title:{
        display: 'flex',
        flexDirection: 'row',
    },
    optionsContainer:{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    optionContainer:{
        width: '100%',
        height: 'auto',
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderBottomColor: colors.third,
    },
    option:{
        height: 'auto',
        width: '100%',
    }
});

export default SelectBox