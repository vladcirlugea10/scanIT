import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Home from '@/app/(tabs)/Home';

jest.mock('expo-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const mockCameraRef = {
    takePictureAsync: jest.fn().mockResolvedValue({
      uri: 'test-photo-uri',
    }),
  };

  const MockCameraView = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => mockCameraRef);
    
    return <View testID="camera-view" {...props} />;
  });

  return {
    useCameraPermissions: jest.fn(),
    CameraView: MockCameraView,
  };
});

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({
    uri: 'manipulated-uri',
    width: 1500,
    height: 2000,
  }),
  SaveFormat: {
    JPEG: 'jpeg',
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn() })),
  useFocusEffect: jest.fn(() => {}),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/hooks/useOpenFoodFacts', () => () => ({
  getProduct: jest.fn(),
  resetProduct: jest.fn(),
  product: undefined,
  notFound: false,
}));

jest.mock('@/components/MyButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  
  return React.forwardRef(({ title, onPress, ...props }: any, ref: any) => (
    <TouchableOpacity onPress={onPress} testID="my-button" {...props}>
      <Text>{title}</Text>
    </TouchableOpacity>
  ));
});

jest.mock('@/components/SelectBox', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  
  return React.forwardRef(({ title, ...props }: AnalyserNode, ref: any) => (
    <TouchableOpacity testID="select-box" {...props}>
      <Text>{title}</Text>
    </TouchableOpacity>
  ))
});

jest.mock('@/components/ToastInfo', () => ({
  toastInfo: jest.fn(),
}));

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#fff',
      secondary: '#000',
    },
  }),
}));

jest.mock('@/assets/styles', () => ({
  createGlobalStyles: () => ({
    textForPressing: {
      fontSize: 16,
    },
  }),
}));

jest.mock('expo-font', () => {
  return {
    ...jest.requireActual('expo-font'),
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
    loadedNativeFonts: [],
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders permission request when camera permission is not granted', () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([{ granted: false }, jest.fn()]);

    const { getByText } = render(<Home />);
    
    expect(getByText('permission to use camera required')).toBeTruthy();
    expect(getByText('request camera permission')).toBeTruthy();
  });

  it('calls requestPermission when button is pressed', () => {
    const mockRequestPermission = jest.fn();
    (useCameraPermissions as jest.Mock).mockReturnValue([{ granted: false }, mockRequestPermission]);

    const { getByText } = render(<Home />);
    
    const button = getByText('request camera permission');
    fireEvent.press(button);
    
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('renders camera view when permission is granted', () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([{ granted: true }, jest.fn()]);

    const { getByTestId } = render(<Home />);
    expect(getByTestId('camera-view')).toBeTruthy();
  });

  it('renders the barcode and photo buttons and instruction text', () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([{ granted: true }, jest.fn()]);

    const { getByTestId, getByText } = render(<Home />);
    expect(getByText('barcode')).toBeTruthy();
    expect(getByText('photo')).toBeTruthy();
    expect(getByText('take a photo of a product label to scan the text')).toBeTruthy();

    const barcodeButton = getByText('barcode');
    fireEvent.press(barcodeButton);
    expect(getByTestId('select-box')).toBeTruthy();
    expect(getByText('scan a product by barcode to get started')).toBeTruthy();
  });

  it('takes a photo and displays it', async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([{ granted: true }, jest.fn()]);

    const { getByTestId, getByText, queryByTestId } = render(<Home />);
    
    const photoModeButton = getByText('photo');
    fireEvent.press(photoModeButton);

    const photoButton = getByTestId('take-photo-button');
    await act(async () => {
      fireEvent.press(photoButton);
    });

    await waitFor(() => {
      expect(queryByTestId("photo-image")).toBeTruthy();
    });
  });

});