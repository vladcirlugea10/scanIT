import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddedProducts from '../app/(tabs)/AddedProducts';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/app/ColorThemeContext';
import useUser from '@/hooks/useUser';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';
import { Alert } from 'react-native';

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

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useUser', () => jest.fn());

jest.mock('@/hooks/useOpenFoodFacts', () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('AddedProducts Screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    
    useTheme.mockReturnValue({
      colors: {
        primary: '#123456',
        secondary: '#654321',
        third: '#789012',
      },
      theme: 'light',
    });
    
    useAuth.mockReturnValue({
      isAuth: true,
      user: {
        addedProductsBarcodes: ['1234567890123', '9876543210987']
      },
      token: 'mock-token',
    });
    
    useUser.mockReturnValue({
      getUserData: jest.fn(),
    });

    useOpenFoodFacts.mockReturnValue({
      getProduct: jest.fn(),
      product: null,
      notFound: false,
      loading: false,
    });
  });
  
  test('renders correctly with added products', () => {
    const { getByText, getAllByText } = render(<AddedProducts />);
    
    expect(getByText('yourAddedProducts:')).toBeTruthy();
    
    expect(getByText('1234567890123')).toBeTruthy();
    expect(getByText('9876543210987')).toBeTruthy();
    
    expect(getAllByText('details').length).toBeGreaterThan(0);
    
    expect(getByText('couldntFindAproduct? addItHere!')).toBeTruthy();
  });
  
  test('redirects to auth when not authenticated', () => {
    useAuth.mockReturnValue({
      isAuth: false,
      user: null,
      token: null,
    });
    
    render(<AddedProducts />);
    
    expect(mockNavigate).toHaveBeenCalledWith('Auth');
  });
  
  test('shows "no products" message when user has no products', () => {
    useAuth.mockReturnValue({
      isAuth: true,
      user: {
        addedProductsBarcodes: []
      },
      token: 'mock-token',
    });
    
    const { getByText } = render(<AddedProducts />);
    
    expect(getByText('noProductsAdded')).toBeTruthy();
  });
  
  test('calls getProduct when details button is pressed', () => {
    const getProductMock = jest.fn();
    useOpenFoodFacts.mockReturnValue({
      getProduct: getProductMock,
      product: null,
      notFound: false,
      loading: false,
    });
    
    const { getAllByText } = render(<AddedProducts />);
    fireEvent.press(getAllByText('details')[0]);
    
    expect(getProductMock).toHaveBeenCalledWith('1234567890123');
  });
  
  test('navigates to BarcodeResults when product details are viewed', async () => {
    let mockProduct = null;
    let mockNotFound = false;

    const getProductMock = jest.fn().mockImplementation((barcode) => {
        setTimeout(() => {
        mockProduct = { _id: '1234567890123', product_name: 'Test Product' };
        
        useOpenFoodFacts.mockReturnValue({
            getProduct: getProductMock,
            product: mockProduct,
            notFound: false,
            loading: false,
        });
        
        if (rerenderComponent) rerenderComponent(<AddedProducts />);
        }, 10);
        
        return Promise.resolve();
    });

    useOpenFoodFacts.mockReturnValue({
        getProduct: getProductMock,
        product: null,
        notFound: false,
        loading: false,
    });
    
    const { getAllByText, rerender } = render(<AddedProducts />);
    const rerenderComponent = rerender;
    
    fireEvent.press(getAllByText('details')[0]);
    
    expect(getProductMock).toHaveBeenCalledWith('1234567890123');
    
    await waitFor(
        () => {
        expect(mockNavigate).toHaveBeenCalledWith('BarcodeResults', { 
            product: expect.objectContaining({ 
            _id: '1234567890123',
            product_name: 'Test Product'
            })
        });
        },
        { timeout: 1000 }
    );
    });
  
  test('shows alert when product is not found', async () => {
    const alertMock = jest.fn();
    Alert.alert = alertMock;
    
    const getProductMock = jest.fn().mockImplementation((barcode) => {
        useOpenFoodFacts.mockReturnValue({
        getProduct: getProductMock,
        product: null,
        notFound: true,
        loading: false,
        });
        
        Alert.alert('error', 'productNotFound');
        return Promise.resolve();
    });
    
    useOpenFoodFacts.mockReturnValue({
        getProduct: getProductMock,
        product: null,
        notFound: false,
        loading: false,
    });
    
    const { getAllByText } = render(<AddedProducts />);
    
    fireEvent.press(getAllByText('details')[0]);
    
    await waitFor(() => {
        expect(alertMock).toHaveBeenCalled();
    });
    });
  
  test('navigates to AddProduct when add product link is pressed', () => {
    const { getByText } = render(<AddedProducts />);
    
    fireEvent.press(getByText('couldntFindAproduct? addItHere!'));
    
    expect(mockNavigate).toHaveBeenCalledWith('AddProduct');
  });
});