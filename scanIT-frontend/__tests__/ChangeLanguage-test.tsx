import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import ChangeLanguage from '../app/(tabs)/ChangeLanguage';
import { useTheme } from '@/app/ColorThemeContext';
import * as SecureStore from 'expo-secure-store';
import { toastSuccess } from '@/components/ToastSuccess';

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.mock('@/i18next', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(null),
  getItemAsync: jest.fn().mockResolvedValue('en-UK'),
}));

jest.mock('@/components/ToastSuccess', () => ({
  toastSuccess: jest.fn(),
}));

jest.mock('@/components/SelectBox', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  return function MockSelectBox(props) {
    return (
      <View testID="select-box">
        <Text>{props.title}</Text>
        <TouchableOpacity
          testID="country-option"
          onPress={() => props.setSelectedOption('Romania')}
        >
          <Text>Select Country</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Mock TouchableOpacity with UK flag
const UKFlagButton = ({ onPress }) => (
  <TouchableOpacity testID="uk-flag-button" onPress={onPress}>
    <Text>UK Flag</Text>
  </TouchableOpacity>
);

// Mock TouchableOpacity with Romania flag
const RomaniaFlagButton = ({ onPress }) => (
  <TouchableOpacity testID="romania-flag-button" onPress={onPress}>
    <Text>Romania Flag</Text>
  </TouchableOpacity>
);

// Mock Image component
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

describe('ChangeLanguage Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    useTheme.mockReturnValue({
      colors: {
        primary: '#123456',
        secondary: '#654321',
        third: '#789012',
      },
      theme: 'light',
    });
  });
  
  test('renders available languages and country selector', () => {
    const { getByText, getByTestId } = render(<ChangeLanguage />);
    
    expect(getByText('availableLanguages:')).toBeTruthy();
    expect(getByTestId('select-box')).toBeTruthy();
  });
  
  test('changes language when UK flag is pressed', async () => {
  const { getByTestId } = render(<ChangeLanguage />);

  fireEvent.press(getByTestId('uk-flag-button'));

  await waitFor(() => {
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('selectedLanguage', 'en-UK');
    expect(toastSuccess).toHaveBeenCalledWith('languageChanged');
  });
});
  
  test('changes language when Romania flag is pressed', async () => {
  const { getByTestId } = render(<ChangeLanguage />);

  fireEvent.press(getByTestId('romania-flag-button'));

  await waitFor(() => {
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('selectedLanguage', 'ro-RO');
    expect(toastSuccess).toHaveBeenCalledWith('languageChanged');
  });
});
  
  test('saves selected country to secure store', async () => {
    const { getByTestId } = render(<ChangeLanguage />);
    
    fireEvent.press(getByTestId('country-option'));
    
    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('selectedCountry', 'Romania');
    });
  });
});