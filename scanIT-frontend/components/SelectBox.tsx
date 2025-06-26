import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/app/ColorThemeContext';

type SelectBoxProps = {
    title?: string;
    options: string[];
    style?: object;
    selectedOption: string;
    setSelectedOption: (option: string) => void;
    testID?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({title, options, style, selectedOption, setSelectedOption, testID}) => {
    const [showOptions, setShowOptions] = useState(false);
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        mainContainer:{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.secondary,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.primary,
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
            position: 'relative',
            zIndex: 100,
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
            position: 'absolute',
            top: '100%',
            width: '100%',
            height: 250,
            zIndex: 100,
        }
    });

    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        setShowOptions(false);
    }

    return (
        <View style={[styles.mainContainer, style]}>
            <TouchableOpacity testID={testID} style={{width: '100%'}} onPress={handleShowOptions}>
                <View style={styles.title}>
                    { selectedOption ? <Text style={styles.textTitle}>{selectedOption}</Text> : ( title ? <Text style={styles.textTitle}>{title}</Text> : <Text style={styles.textTitle}>Select</Text> ) }
                    <MaterialCommunityIcons name="chevron-down" size={24} color={colors.primary} />
                </View>
            </TouchableOpacity>
            { showOptions &&
                <View style={styles.scrollContainer}>
                    <ScrollView nestedScrollEnabled={true}>
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

export default SelectBox