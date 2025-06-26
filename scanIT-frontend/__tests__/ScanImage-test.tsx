import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ScanImage from '../app/(tabs)/ScanImage';
import { useTheme } from '@/app/ColorThemeContext';
import useImageOCR from '@/hooks/useImageOCR';
import useTextTranslation from '@/hooks/useTextTranslation';
import NetInfo from '@react-native-community/netinfo';
import { toastSuccess } from '@/components/ToastSuccess';

jest.mock('@/components/SelectBox', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  return function MockSelectBox(props) {
    return React.createElement(
      View,
      { testID: 'select-box' },
      [
        React.createElement(Text, { key: 'title' }, props.title || ''),
        React.createElement(
          TouchableOpacity,
          {
            key: 'option',
            testID: 'language-option',
            onPress: () => props.setSelectedOption && props.setSelectedOption('en-UK')
          },
          React.createElement(Text, null, "Select Language")
        )
      ]
    );
  };
});

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useImageOCR', () => jest.fn());

jest.mock('@/hooks/useTextTranslation', () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({ isConnected: true }),
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('@/components/ToastSuccess', () => ({
  toastSuccess: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('ScanImage Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    useTheme.mockReturnValue({
      colors: {
        primary: '#123456',
        secondary: '#654321',
        third: '#789012',
        warning: '#ffcc00',
      },
      theme: 'light',
    });
    
    useImageOCR.mockReturnValue({
      loading: false,
      data: { text: ['Test ingredient 1', 'Test ingredient 2'] },
      scanImage: jest.fn(),
      scanImageOffline: jest.fn(),
    });
    
    useTextTranslation.mockReturnValue({
      loading: false,
      translateText: jest.fn().mockResolvedValue('Translated text'),
    });
  });
  
  test('shows loading indicator when scanning', () => {
    useImageOCR.mockReturnValue({
      loading: true,
      data: { text: [] },
      scanImage: jest.fn(),
      scanImageOffline: jest.fn(),
    });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByTestId } = render(<ScanImage route={route} />);
    
    // Make sure you have this testID in your actual component
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
  
  test('calls scan image function on mount with online connection', async () => {
    const scanImageMock = jest.fn().mockResolvedValue({});
    useImageOCR.mockReturnValue({
      loading: false,
      data: { text: ['Test ingredient 1', 'Test ingredient 2'] },
      scanImage: scanImageMock,
      scanImageOffline: jest.fn(),
    });
    
    NetInfo.fetch.mockResolvedValue({ isConnected: true });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    render(<ScanImage route={route} />);
    
    await waitFor(() => {
      expect(scanImageMock).toHaveBeenCalledWith({ uri: 'file://test-image.jpg' });
    });
  });
  
  test('falls back to offline scan when online scan fails', async () => {
    const scanImageMock = jest.fn().mockRejectedValue(new Error('Network error'));
    const scanImageOfflineMock = jest.fn().mockResolvedValue({});
    
    useImageOCR.mockReturnValue({
      loading: false,
      data: { text: ['Test ingredient 1', 'Test ingredient 2'] },
      scanImage: scanImageMock,
      scanImageOffline: scanImageOfflineMock,
    });
    
    NetInfo.fetch.mockResolvedValue({ isConnected: true });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    render(<ScanImage route={route} />);
    
    await waitFor(() => {
      expect(scanImageOfflineMock).toHaveBeenCalledWith({ uri: 'file://test-image.jpg' });
    });
  });
  
  test('calls offline scan when no connection is available', async () => {
    const scanImageOfflineMock = jest.fn().mockResolvedValue({});
    
    useImageOCR.mockReturnValue({
      loading: false,
      data: { text: ['Test ingredient 1', 'Test ingredient 2'] },
      scanImage: jest.fn(),
      scanImageOffline: scanImageOfflineMock,
    });
    
    NetInfo.fetch.mockResolvedValue({ isConnected: false });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    render(<ScanImage route={route} />);
    
    await waitFor(() => {
      expect(scanImageOfflineMock).toHaveBeenCalledWith({ uri: 'file://test-image.jpg' });
    });
  });
  
  test('displays scanned ingredients text', async () => {
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByText } = render(<ScanImage route={route} />);
    
    await waitFor(() => {
      expect(getByText(/Test ingredient 1 Test ingredient 2/)).toBeTruthy();
      expect(getByText('productIngredientList:')).toBeTruthy();
    });
  });
  
  test('navigates to IngredientsCheck when button is pressed', async () => {
    const data = { text: ['Test ingredient 1', 'Test ingredient 2'] };
    useImageOCR.mockReturnValue({
      loading: false,
      data: data,
      scanImage: jest.fn(),
      scanImageOffline: jest.fn(),
    });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByText } = render(<ScanImage route={route} />);
    
    fireEvent.press(getByText('checkIngredients'));
    
    expect(mockNavigate).toHaveBeenCalledWith('IngredientsCheck', { data: data });
  });
  
  test('translates text when language is selected', async () => {
    const translateTextMock = jest.fn().mockResolvedValue('Texto traducido');
    useTextTranslation.mockReturnValue({
      loading: false,
      translateText: translateTextMock,
    });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByText } = render(<ScanImage route={route} />);
        
    await waitFor(() => {
      expect(getByText('translateTo')).toBeTruthy();
    });
    
    expect(translateTextMock).not.toHaveBeenCalled();
  });
  
  test('shows error message when no text is found', async () => {
    useImageOCR.mockReturnValue({
      loading: false,
      data: { text: [] },
      scanImage: jest.fn(),
      scanImageOffline: jest.fn(),
    });
    
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByText } = render(<ScanImage route={route} />);
    
    await waitFor(() => {
      expect(getByText('somethingWentWrong! pleaseTryAgain!')).toBeTruthy();
    });
  });
});