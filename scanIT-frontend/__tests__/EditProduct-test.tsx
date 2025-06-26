import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProduct from '../app/(tabs)/EditProduct';
import { useTheme } from '@/app/ColorThemeContext';
import { useAuth } from '@/hooks/useAuth';
import useUser from '@/hooks/useUser';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';
import * as ImagePicker from 'expo-image-picker';
import { toastSuccess, toastError } from '@/components/ToastSuccess';

// Mock dependencies
jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/useUser', () => jest.fn());

jest.mock('@/hooks/useOpenFoodFacts', () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

jest.mock('@/components/ToastSuccess', () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

// Mock ImagePicker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

// Mock MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => {
  return {
    MaterialCommunityIcons: function(props) {
      return {
        type: 'MaterialCommunityIcons',
        props
      };
    }
  };
});

// Mock MyButton component
jest.mock('@/components/MyButton', () => function(props) {
  return {
    type: 'MyButton',
    props: {
      ...props,
      testID: 'my-button'
    }
  };
});

// Mock ShakingErrorText component
jest.mock('@/components/ShakingErrorText', () => function(props) {
  return {
    type: 'ShakingErrorText',
    props: {
      ...props,
      testID: 'error-text'
    }
  };
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('EditProduct Screen', () => {
  const mockProduct = {
    _id: '1234567890123',
    product_name: 'Test Product',
    brands: 'Test Brand',
    categories: 'Test Category',
    countries: 'Romania',
    stores: 'Test Store',
    ingredients_text: 'Test ingredients',
    nutriments: {
      carbohydrates: 50,
      carbohydrates_100g: 25,
      energy: 200,
      energy_100g: 100,
      'energy-kcal': 150,
      'energy-kcal_100g': 75,
      fat: 10,
      fat_100g: 5,
      proteins: 8,
      proteins_100g: 4,
      salt: 2,
      salt_100g: 1,
      saturated_fat: 6,
      saturated_fat_100g: 3,
      sodium: 0.8,
      sodium_100g: 0.4,
      sugars: 20,
      sugars_100g: 10,
    }
  };

  const mockRoute = {
    params: {
      barcode: '1234567890123',
      product: mockProduct,
    }
  };

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
    
    useAuth.mockReturnValue({
      token: 'test-token',
    });
    
    useUser.mockReturnValue({
      addEditedProduct: jest.fn().mockResolvedValue(true),
      loading: false,
    });
    
    useOpenFoodFacts.mockReturnValue({
      editProduct: jest.fn().mockResolvedValue({ status: 1 }),
      addImage: jest.fn().mockResolvedValue({ status: 1 }),
      loading: false,
      error: null,
    });
  });
  
  test('handles product submission successfully', async () => {
    jest.useFakeTimers();
    
    const { getByText } = render(<EditProduct route={mockRoute} />);
    
    const { editProduct } = useOpenFoodFacts();
    const { addEditedProduct } = useUser();
    
    // Submit the form
    fireEvent.press(getByText('submitProduct'));
    
    // We need to wait for the asynchronous operations
    await waitFor(() => {
      expect(editProduct).toHaveBeenCalled();
      expect(addEditedProduct).toHaveBeenCalledWith('1234567890123');
      expect(toastSuccess).toHaveBeenCalledWith('productEdited');
    });
    
    // Test navigation after success (with timeout)
    jest.advanceTimersByTime(3000);
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
    
    jest.useRealTimers();
  });
  
  test('handles error when product submission fails', async () => {
    useOpenFoodFacts.mockReturnValue({
      editProduct: jest.fn().mockResolvedValue({ status: 0 }),
      addImage: jest.fn().mockResolvedValue({ status: 1 }),
      loading: false,
      error: null,
    });
    
    const { getByText } = render(<EditProduct route={mockRoute} />);
    
    fireEvent.press(getByText('submitProduct'));
    
    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('errorEditingProduct');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  
  test('shows loading state during submission', async () => {
    useOpenFoodFacts.mockReturnValue({
      editProduct: jest.fn(() => new Promise(resolve => setTimeout(() => resolve({ status: 1 }), 100))),
      addImage: jest.fn().mockResolvedValue({ status: 1 }),
      loading: true,
      error: null,
    });
    
    const { getByTestId } = render(<EditProduct route={mockRoute} />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});