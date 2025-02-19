import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/assets/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type SelectBoxProps = {
    title?: string;
    options: string[];
    style?: object;
    selectedOption: string;
    setSelectedOption: (option: string) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({title, options, style, selectedOption, setSelectedOption}) => {
    const [showOptions, setShowOptions] = useState(false);

    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        setShowOptions(false);
    }

    return (
        <View style={[styles.mainContainer, style]}>
            <TouchableOpacity style={{width: '100%'}} onPress={handleShowOptions}>
                <View style={styles.title}>
                    { selectedOption ? <Text style={styles.textTitle}>{selectedOption}</Text> : ( title ? <Text style={styles.textTitle}>{title}</Text> : <Text style={styles.textTitle}>Select</Text> ) }
                    <MaterialCommunityIcons name="chevron-down" size={24} color={colors.primary} />
                </View>
            </TouchableOpacity>
            { showOptions &&
                <View style={styles.scrollContainer}>
                    <ScrollView>
                        <View style={styles.optionsContainer}>
                            {options.map((option, index) => (
                                <TouchableOpacity style={styles.optionContainer} key={index} onPress={() => handleSelectOption(option)}>
                                    <View style={{alignContent: 'center', justifyContent: 'center'}}>
                                        <Text style={styles.option}>{option}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
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
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    textTitle:{
        fontWeight: 'bold',
        color: colors.primary,
    },
    optionsContainer:{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.primary,
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
        fontWeight: 'bold',
    },
    scrollContainer:{
        width: '100%',
        height: 250
    }
});

export default SelectBox