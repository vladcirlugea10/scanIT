import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddProduct from '../app/(tabs)/AddProduct';
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

jest.mock('@/components/ToastSuccess', () => ({
  toastSuccess: jest.fn(),
}));

jest.mock('@/components/ToastError', () => ({
  toastError: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://test.jpg' }]
  }),
  launchCameraAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://test-camera.jpg' }]
  }),
}));

describe('AddProduct Screen', () => {
  let mockOpenFoodFacts;
  
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
      token: 'mock-token',
    });
    
    useUser.mockReturnValue({
      addNewProduct: jest.fn().mockResolvedValue({}),
    });

    // Create a default mock that can be overridden
    mockOpenFoodFacts = {
      getProduct: jest.fn(),
      addProduct: jest.fn().mockResolvedValue({ status: 1 }),
      addImage: jest.fn().mockResolvedValue({}),
      product: null,
      notFound: false,
      loading: false,
      error: null,
      resetProduct: jest.fn(),
    };
    
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
  });
  
  test('renders barcode input initially', () => {
    const { getByText, getByPlaceholderText } = render(<AddProduct />);
    
    expect(getByText('enterBarcode:')).toBeTruthy();
    expect(getByPlaceholderText('barcode')).toBeTruthy();
    expect(getByText('submitBarcode')).toBeTruthy();
  });
  
  test('shows error when submitting empty barcode', () => {
    const { getByText } = render(<AddProduct />);
    
    fireEvent.press(getByText('submitBarcode'));
    
    expect(getByText('Barcode is empty')).toBeTruthy();
  });
  
  test('calls getProduct when barcode is submitted', async () => {
    const mockGetProduct = jest.fn();
    mockOpenFoodFacts.getProduct = mockGetProduct;
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
    
    const { getByText, getByPlaceholderText } = render(<AddProduct />);
    
    fireEvent.changeText(getByPlaceholderText('barcode'), '1234567890123');
    fireEvent.press(getByText('submitBarcode'));
    
    expect(mockGetProduct).toHaveBeenCalledWith('1234567890123');
  });
  
  test('shows product form when product is not found', async () => {
    const { getByText, getByPlaceholderText, rerender } = render(<AddProduct />);
    
    fireEvent.changeText(getByPlaceholderText('barcode'), '1234567890123');
    fireEvent.press(getByText('submitBarcode'));
    
    mockOpenFoodFacts.notFound = true;
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
    
    rerender(<AddProduct />);
    
    await waitFor(() => {
      expect(getByText('productName')).toBeTruthy();
      expect(getByText('frontPackageImage')).toBeTruthy();
      expect(getByText('submitProduct')).toBeTruthy();
    });
  });
  
  test('navigates to edit product when product exists', async () => {
    const mockProduct = { _id: '1234567890123', product_name: 'Test Product' };
    
    const { getByText, getByPlaceholderText, rerender } = render(<AddProduct />);
    
    fireEvent.changeText(getByPlaceholderText('barcode'), '1234567890123');
    fireEvent.press(getByText('submitBarcode'));
    
    mockOpenFoodFacts.product = mockProduct;
    mockOpenFoodFacts.notFound = false;
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
    
    rerender(<AddProduct />);

    await waitFor(() => {
      expect(getByText('editProduct')).toBeTruthy();
    });

    fireEvent.press(getByText('editProduct'));
    expect(mockNavigate).toHaveBeenCalledWith('EditProduct', {
      barcode: '1234567890123',
      product: mockProduct
    });
  });
  
  test('calls addProduct and addNewProduct when submitting new product', async () => {
    const mockAddProduct = jest.fn().mockResolvedValue({ status: 1 });
    const mockAddNewProduct = jest.fn().mockResolvedValue({});
    
    mockOpenFoodFacts.addProduct = mockAddProduct;
    mockOpenFoodFacts.notFound = true;
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
    
    useUser.mockReturnValue({
      addNewProduct: mockAddNewProduct,
    });
    
    const { getByText, getByPlaceholderText, rerender } = render(<AddProduct />);
    
    // Submit barcode first
    fireEvent.changeText(getByPlaceholderText('barcode'), '1234567890123');
    fireEvent.press(getByText('submitBarcode'));
    
    // Rerender to show product form
    rerender(<AddProduct />);

    await waitFor(() => {
      expect(getByPlaceholderText('productName')).toBeTruthy();
    });

    // Fill in product details
    fireEvent.changeText(getByPlaceholderText('productName'), 'Test Product');
    fireEvent.changeText(getByPlaceholderText('Brand'), 'Test Brand');
    
    fireEvent.press(getByText('submitProduct'));
    
    await waitFor(() => {
      expect(mockAddProduct).toHaveBeenCalled();
    });
  });
  
  test('uploads images when available', async () => {
    const mockAddImage = jest.fn().mockResolvedValue({});
    
    mockOpenFoodFacts.addImage = mockAddImage;
    mockOpenFoodFacts.notFound = true;
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
    
    const { getByText, getByPlaceholderText, rerender } = render(<AddProduct />);
    
    fireEvent.changeText(getByPlaceholderText('barcode'), '1234567890123');
    fireEvent.press(getByText('submitBarcode'));
    
    rerender(<AddProduct />);
    
    await waitFor(() => {
      expect(getByText('submitProduct')).toBeTruthy();
    });
    
    fireEvent.press(getByText('submitProduct'));
    
    await waitFor(() => {
      expect(mockAddImage).toHaveBeenCalledTimes(0); // No images in this test
    });
  });
  
  test('shows loading indicator when loading', () => {
    mockOpenFoodFacts.loading = true;
    useOpenFoodFacts.mockReturnValue(mockOpenFoodFacts);
    
    const { getByTestId } = render(<AddProduct />);
    
    // Make sure your ActivityIndicator has testID="loading-indicator"
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
  
  test('shows error when product submission fails', async () => {
  const mockToastError = require('@/components/ToastError').toastError;
  
  // Mock the sequence of states
  const mockGetProduct = jest.fn()
    .mockImplementationOnce(() => {
      // First call - set loading to true
      useOpenFoodFacts.mockReturnValue({
        ...mockOpenFoodFacts,
        loading: true,
        notFound: false,
        getProduct: mockGetProduct
      });
    })
    .mockImplementationOnce(() => {
      // Second call - set notFound to true, loading to false
      useOpenFoodFacts.mockReturnValue({
        ...mockOpenFoodFacts,
        loading: false,
        notFound: true,
        addProduct: jest.fn().mockResolvedValue({ status: 0 }),
        getProduct: mockGetProduct
      });
    });

  useOpenFoodFacts.mockReturnValue({
    ...mockOpenFoodFacts,
    getProduct: mockGetProduct,
    addProduct: jest.fn().mockResolvedValue({ status: 0 })
  });
  
  const { getByText, getByPlaceholderText } = render(<AddProduct />);
  
  // Enter barcode and submit
  fireEvent.changeText(getByPlaceholderText('barcode'), '1234567890123');
  fireEvent.press(getByText('submitBarcode'));
  
  // Wait for the form to appear after product is not found
  await waitFor(() => {
    expect(getByText('submitProduct')).toBeTruthy();
  }, { timeout: 3000 });
  
  // Fill out required fields
  fireEvent.changeText(getByPlaceholderText('productName'), 'Test Product');
  
  fireEvent.press(getByText('submitProduct'));
  
  await waitFor(() => {
    expect(mockToastError).toHaveBeenCalledWith('productNotAdded');
  });
});
});