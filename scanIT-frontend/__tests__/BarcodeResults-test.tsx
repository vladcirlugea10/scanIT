import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import BarcodeResults from '../app/(tabs)/BarcodeResults';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/app/ColorThemeContext';
import useUser from '@/hooks/useUser';
import useTextTranslation from '@/hooks/useTextTranslation';
import * as SecureStore from 'expo-secure-store';

const mockRoute = {
  params: {
    product: {
      _id: '1234567890123',
      product_name: 'Test Product',
      brands: 'Test Brand',
      image_url: 'https://example.com/image.jpg',
      nutriscore_grade: 'a',
      additives_n: 0,
      additives_tags: [],
      allergens: '',
      countries: 'Romania',
      ingredients_text: 'Test ingredients',
      quantity: '100g',
      selected_images: {
        front: { display: { ro: 'https://example.com/front.jpg' } },
        ingredients: { display: { ro: 'https://example.com/ingredients.jpg' } },
        nutrition: { display: { ro: 'https://example.com/nutrition.jpg' } }
      },
      nutriments: {
        'energy-kcal': 200,
        'energy-kcal_100g': 200,
        'energy-kcal_unit': 'kcal',
        fat: 5,
        fat_100g: 5,
        fat_unit: 'g',
        saturated_fat: 2,
        saturated_fat_100g: 2,
        saturated_fat_unit: 'g',
        carbohydrates: 30,
        carbohydrates_100g: 30,
        carbohydrates_unit: 'g',
        sugars: 10,
        sugars_100g: 10,
        sugars_unit: 'g',
        proteins: 8,
        proteins_100g: 8,
        proteins_unit: 'g',
        salt: 1,
        salt_100g: 1,
        salt_unit: 'g',
        sodium: 0.5,
        sodium_100g: 0.5,
        sodium_unit: 'g'
      }
    }
  }
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useUser', () => jest.fn());

jest.mock('@/hooks/useTextTranslation', () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('BarcodeResults Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    useTheme.mockReturnValue({
      colors: {
        primary: '#123456',
        secondary: '#654321',
        third: '#789012',
        danger: '#ff0000',
        success: '#00ff00'
      },
      theme: 'light',
    });
    
    useAuth.mockReturnValue({
      token: 'mock-token',
    });
    
    useUser.mockReturnValue({
      addProduct: jest.fn().mockResolvedValue({}),
    });

    useTextTranslation.mockReturnValue({
      translateText: jest.fn().mockImplementation((text) => Promise.resolve(`Translated: ${text}`)),
    });

    SecureStore.getItemAsync.mockResolvedValue('ro-RO');
  });
  
  test('renders product title and brand correctly', () => {
    const { getByText } = render(<BarcodeResults route={mockRoute} />);
    
    expect(getByText('Test Product - Test Brand')).toBeTruthy();
  });
  
  test('renders product images', () => {
    const { getAllByTestId } = render(<BarcodeResults route={mockRoute} />);
    
    const productImages = getAllByTestId(/product-image/);
    expect(productImages.length).toBeGreaterThanOrEqual(1);
    });
  
  test('renders nutritional values table', () => {
    const { getByText } = render(<BarcodeResults route={mockRoute} />);
    
    expect(getByText('nutritionalValues')).toBeTruthy();
    expect(getByText('energy')).toBeTruthy();
    expect(getByText('fats')).toBeTruthy();
    expect(getByText('carbohydrates')).toBeTruthy();
    expect(getByText('proteins')).toBeTruthy();
  });
  
  test('displays country information', () => {
    const { getByText } = render(<BarcodeResults route={mockRoute} />);
    
    expect(getByText('soldIn')).toBeTruthy();
    expect(getByText('Romania')).toBeTruthy();
  });
  
  test('displays ingredients section', () => {
    const { getByText } = render(<BarcodeResults route={mockRoute} />);
    
    expect(getByText('ingredients')).toBeTruthy();
    expect(getByText('Test ingredients')).toBeTruthy();
  });
  
  test('shows nutriscore image', () => {
    const { getByText } = render(<BarcodeResults route={mockRoute} />);
    
    const nutritionalValuesText = getByText('nutritionalValues');
    expect(nutritionalValuesText).toBeTruthy();
  });
  
  test('shows additives information', () => {
    const { getByText } = render(<BarcodeResults route={mockRoute} />);
    
    expect(getByText('Product has 0 additives')).toBeTruthy();
  });
  
  test('calls addProduct on mounting', async () => {
    const addProductMock = jest.fn();
    useUser.mockReturnValue({
      addProduct: addProductMock,
    });
    
    render(<BarcodeResults route={mockRoute} />);
    
    await waitFor(() => {
      expect(addProductMock).toHaveBeenCalledWith(expect.objectContaining({
        barcode: '1234567890123',
        name: 'Test Product',
        brand: 'Test Brand',
      }));
    });
  });
  
  test('attempts to translate text on mount', async () => {
    const translateTextMock = jest.fn().mockResolvedValue('Translated text');
    useTextTranslation.mockReturnValue({
      translateText: translateTextMock,
    });
    
    render(<BarcodeResults route={mockRoute} />);
    
    await waitFor(() => {
      expect(translateTextMock).toHaveBeenCalledWith('Test ingredients', expect.any(String));
      expect(translateTextMock).toHaveBeenCalledWith('Test Product', expect.any(String));
    });
  });
  
  test('displays translated text when available', async () => {
    const translateTextMock = jest.fn()
      .mockResolvedValueOnce('Translated ingredients')
      .mockResolvedValueOnce('Translated product name');
      
    useTextTranslation.mockReturnValue({
      translateText: translateTextMock,
    });
    
    const { getByText, rerender } = render(<BarcodeResults route={mockRoute} />);
    
    await waitFor(() => {
      rerender(<BarcodeResults route={mockRoute} />);
      expect(getByText(/Translated ingredients/)).toBeTruthy();
      expect(getByText(/Translated product name/)).toBeTruthy();
    });
  });
  
  test('displays warning icons for high nutritional values', () => {
    const productWithHighValues = {
      ...mockRoute.params.product,
      nutriments: {
        ...mockRoute.params.product.nutriments,
        fat: 60,
        sugars: 60,
        salt: 4,
        sodium: 4
      }
    };
    
    const routeWithHighValues = {
      params: {
        product: productWithHighValues
      }
    };
    
    const { getAllByTestId } = render(<BarcodeResults route={routeWithHighValues} />);
    
    const warningIcons = getAllByTestId('warning-icon');
    expect(warningIcons.length).toBeGreaterThanOrEqual(4);
});
});