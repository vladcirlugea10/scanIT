import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import ImageEdit from '../app/(tabs)/ImageEdit';
import { useTheme } from '@/app/ColorThemeContext';
import { toastSuccess } from '@/components/ToastSuccess';
import * as ImageManipulator from 'expo-image-manipulator';

// Mock dependencies
jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('@/components/ToastSuccess', () => ({
  toastSuccess: jest.fn(),
}));

// Proper React Native mock component for ImageCropper
jest.mock('@/components/ImageCropper', () => {
  // Import components inside the mock
  const React = require('react');
  const { View, TouchableOpacity, Text, Image } = require('react-native');

  return function MockImageCropper({ imageUri, onCropComplete }) {
    return React.createElement(
      View, 
      { testID: "image-cropper" },
      React.createElement(
        TouchableOpacity,
        { 
          testID: "crop-button",
          onPress: () => onCropComplete({originX: 10, originY: 20, width: 300, height: 400})
        },
        React.createElement(Text, null, "Complete Crop")
      ),
      React.createElement(Image, { source: {uri: imageUri} })
    );
  };
});

// Fixed MyButton mock - import React Native components inside the mock
jest.mock('@/components/MyButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  
  return function MockMyButton({ title, onPress }) {
    return React.createElement(
      TouchableOpacity,
      { testID: "my-button", onPress: onPress },
      React.createElement(Text, null, title)
    );
  };
});

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({ uri: 'file://cropped-image.jpg' }),
  SaveFormat: { JPEG: 'jpeg' },
}));

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

describe('ImageEdit Screen', () => {
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
  
  test('renders ImageCropper initially', () => {
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByTestId } = render(<ImageEdit route={route} />);
    
    expect(getByTestId('image-cropper')).toBeTruthy();
  });
  
  test('processes image when cropping is completed', async () => {
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByTestId } = render(<ImageEdit route={route} />);
    
    await act(async () => {
      fireEvent.press(getByTestId('crop-button'));
    });
    
    await waitFor(() => {
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
        'file://test-image.jpg', 
        [{ crop: { originX: 10, originY: 20, width: 300, height: 400 } }],
        { compress: 1, format: 'jpeg' }
      );
      expect(toastSuccess).toHaveBeenCalledWith('imageCropped');
    });
  });
  
  test('shows cropped image after processing and navigates to ScanImage', async () => {
    const route = { params: { photoUri: 'file://test-image.jpg' } };
    const { getByTestId, queryByTestId, getByText } = render(<ImageEdit route={route} />);
    
    await act(async () => {
      fireEvent.press(getByTestId('crop-button'));
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // After cropping, ImageCropper should be gone
    expect(queryByTestId('image-cropper')).toBeNull();
    
    // The scan button should now be visible
    expect(getByText('scanImage')).toBeTruthy();
    
    // Press scan button
    fireEvent.press(getByText('scanImage'));
    
    expect(mockNavigate).toHaveBeenCalledWith('ScanImage', { 
      photoUri: 'file://cropped-image.jpg' 
    });
  });
  
  test('uses original image if no cropping is done', async () => {
        // We need to mock the useState calls in the component
        // First mock (for isCropping) returns false to skip cropping
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
        // Second mock (for croppedImage) returns empty string
        jest.spyOn(React, 'useState').mockImplementationOnce(() => ["", jest.fn()]);
        
        const route = { params: { photoUri: 'file://test-image.jpg' } };
        
        const { getByText } = render(<ImageEdit route={route} />);
        
        // Now the component should render the scan button directly
        expect(getByText('scanImage')).toBeTruthy();
        
        fireEvent.press(getByText('scanImage'));
        
        expect(mockNavigate).toHaveBeenCalledWith('ScanImage', { 
            photoUri: 'file://test-image.jpg' 
        });
    });
});