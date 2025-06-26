import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditedProducts from '../app/(tabs)/EditedProducts';
import { useTheme } from '@/app/ColorThemeContext';
import { useAuth } from '@/hooks/useAuth';
import useUser from '@/hooks/useUser';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';
import { Alert } from 'react-native';

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/useUser', () => jest.fn());

jest.mock('@/hooks/useOpenFoodFacts', () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});
global.alert = jest.fn();

jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name, size, color, onPress }) => (
      <View testID={`icon-${name}`} onPress={onPress}>
        <Text>{name}</Text>
      </View>
    )
  };
});

jest.mock('@/components/BarcodeModal', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  
  return function MockBarcodeModal({ visible, onClose, onPressSubmit }) {
    if (!visible) return null;
    
    return (
      <View testID="barcode-modal">
        <TouchableOpacity testID="close-modal" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="submit-barcode" onPress={() => onPressSubmit('1234567890123')}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
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

describe('EditedProducts Screen', () => {
  let mockGetProduct;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProduct = jest.fn();
    
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
      user: {
        editedProductsBarcodes: ['1234567890123', '9876543210987'],
      },
      isAuth: true,
    });
    
    useUser.mockReturnValue({
      getUserData: jest.fn(),
    });
    
    useOpenFoodFacts.mockReturnValue({
      product: null,
      getProduct: mockGetProduct,
      loading: false,
      notFound: false,
    });
  });
  
  test('renders the list of edited products', () => {
    const { getByText } = render(<EditedProducts />);
    
    expect(getByText('yourEditedProducts:')).toBeTruthy();
    expect(getByText('1234567890123')).toBeTruthy();
    expect(getByText('9876543210987')).toBeTruthy();
  });
  
  test('shows message when no edited products are available', () => {
    useAuth.mockReturnValue({
      token: 'test-token',
      user: {
        editedProductsBarcodes: [],
      },
      isAuth: true,
    });
    
    const { getByText } = render(<EditedProducts />);
    
    expect(getByText('noProductsEdited')).toBeTruthy();
  });
  
  test('navigates to EditProduct when barcode is submitted through modal and product is found', async () => {
    const mockProduct = { _id: '1234567890123', product_name: 'Test Product' };
    
    useOpenFoodFacts.mockReturnValue({
      product: mockProduct,
      getProduct: mockGetProduct,
      loading: false,
      notFound: false,
    });
    
    const { getByText, getByTestId } = render(<EditedProducts />);
    
    fireEvent.press(getByText('editExistingProduct'));
    expect(getByTestId('barcode-modal')).toBeTruthy();
    
    fireEvent.press(getByTestId('submit-barcode'));
    
    await waitFor(() => {
      expect(mockGetProduct).toHaveBeenCalledWith('1234567890123');
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('EditProduct', {
        barcode: '1234567890123',
        product: mockProduct
      });
    });
  });
  
  test('shows alert when barcode is submitted through modal but product is not found', async () => {
    mockGetProduct.mockResolvedValue(null);
    
    useOpenFoodFacts.mockReturnValue({
      product: null,
      getProduct: mockGetProduct,
      loading: false,
      notFound: true,
    });
    
    const { getByText, getByTestId } = render(<EditedProducts />);
    
    fireEvent.press(getByText('editExistingProduct'));
    
    await act(async () => {
      fireEvent.press(getByTestId('submit-barcode'));
    });
    
    expect(mockGetProduct).toHaveBeenCalledWith('1234567890123');
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'error',
        'productNotFound',
        [{ text: 'OK', style: 'cancel' }]
      );
    });
  });
  
  test('navigates to BarcodeResults when details is pressed and product is found', async () => {
    const mockProduct = { _id: '1234567890123', product_name: 'Test Product' };
    
    let currentProduct = null;
    
    mockGetProduct.mockImplementation(async (barcode) => {
      currentProduct = mockProduct;
      useOpenFoodFacts.mockReturnValue({
        product: currentProduct,
        getProduct: mockGetProduct,
        loading: false,
        notFound: false,
      });
    });
    
    const { getAllByText, rerender } = render(<EditedProducts />);
    
    await act(async () => {
      fireEvent.press(getAllByText('details')[0]);
    });
    
    rerender(<EditedProducts />);
    
    await waitFor(() => {
      expect(mockGetProduct).toHaveBeenCalledWith('1234567890123');
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('BarcodeResults', {
        product: mockProduct
      });
    });
  });
  
  test('shows alert when details is pressed but product is not found', async () => {
    let notFoundState = false;
    
    mockGetProduct.mockImplementation(async (barcode) => {
      notFoundState = true;
      useOpenFoodFacts.mockReturnValue({
        product: null,
        getProduct: mockGetProduct,
        loading: false,
        notFound: notFoundState,
      });
    });
    
    const { getAllByText, rerender } = render(<EditedProducts />);
    
    await act(async () => {
      fireEvent.press(getAllByText('details')[0]);
    });
    
    rerender(<EditedProducts />);
    
    await waitFor(() => {
      expect(mockGetProduct).toHaveBeenCalledWith('1234567890123');
    });
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('product not found');
    });
  });
  
  test('redirects to Auth screen when user is not authenticated', () => {
    useAuth.mockReturnValue({
      token: null,
      user: null,
      isAuth: false,
    });
    
    render(<EditedProducts />);
    
    expect(mockNavigate).toHaveBeenCalledWith('Auth');
  });
  
  test('opens and closes barcode modal', () => {
    const { getByText, getByTestId, queryByTestId } = render(<EditedProducts />);
    
    fireEvent.press(getByText('editExistingProduct'));    
    expect(getByTestId('barcode-modal')).toBeTruthy();
    
    fireEvent.press(getByTestId('close-modal'));
    expect(queryByTestId('barcode-modal')).toBeNull();
  });
});