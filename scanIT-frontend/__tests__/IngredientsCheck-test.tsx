import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import IngredientsCheck from '../app/(tabs)/IngredientsCheck';
import { useTheme } from '@/app/ColorThemeContext';
import { useAuth } from '@/hooks/useAuth';
import * as SQLite from '@/database/local/sqLite';
import { GetAllergenIngredient } from '@/types/AllergenIngredient';

// Mock dependencies
jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('@/database/local/sqLite', () => ({
  getIngredientsAllergens: jest.fn(),
  getIngredientsUnhealthy: jest.fn(),
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Sample data
const mockAllergens: GetAllergenIngredient[] = [
  { id: 1, name: 'gluten', group: 'Gluten', description: 'Common allergen' },
  { id: 2, name: 'milk', group: 'Lactate', description: 'Dairy allergen' },
];

const mockUnhealthy: GetAllergenIngredient[] = [
  { id: 3, name: 'e621', group: 'Îndulcitor', description: 'Artificial sweetener' },
  { id: 4, name: 'msg', group: 'Aditiv', description: 'Flavor enhancer' },
];

describe('IngredientsCheck Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    useTheme.mockReturnValue({
      colors: {
        primary: '#123456',
        secondary: '#654321',
        third: '#789012',
        danger: '#FF0000',
        warning: '#FFA500',
        success: '#00FF00',
      },
      theme: 'light',
    });
    
    useAuth.mockReturnValue({
      user: {
        allergies: ['Gluten'],
      },
    });
    
    SQLite.getIngredientsAllergens.mockResolvedValue([]);
    SQLite.getIngredientsUnhealthy.mockResolvedValue([]);
  });
  
  test('renders success message when no ingredients match', async () => {
    // Setup test data
    const route = {
      params: {
        data: {
          text: ['sugar', 'water', 'salt']
        }
      }
    };
    
    const { getByText } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('noBadIngredientsFound!')).toBeTruthy();
    });
  });
  
  test('shows allergen ingredients when found', async () => {
    // Setup mock database response
    SQLite.getIngredientsAllergens.mockResolvedValue(mockAllergens);
    
    // Setup test data with matching ingredient
    const route = {
      params: {
        data: {
          text: ['sugar', 'gluten', 'salt']
        }
      }
    };
    
    const { getByText } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('allergenIngredients:')).toBeTruthy();
      expect(getByText('gluten(Gluten)')).toBeTruthy();
      expect(getByText('noUnhealthyIngredientsFound!')).toBeTruthy();
    });
  });
  
  test('shows unhealthy ingredients when found', async () => {
    // Setup mock database response
    SQLite.getIngredientsUnhealthy.mockResolvedValue(mockUnhealthy);
    
    // Setup test data with matching ingredient
    const route = {
      params: {
        data: {
          text: ['sugar', 'e621', 'salt']
        }
      }
    };
    
    const { getByText } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('unhealthyIngredients:')).toBeTruthy();
      expect(getByText('e621(Îndulcitor)')).toBeTruthy();
      expect(getByText('noAllergenIngredientsFound!')).toBeTruthy();
    });
  });
  
  test('shows both allergen and unhealthy ingredients when found', async () => {
    // Setup mock database responses
    SQLite.getIngredientsAllergens.mockResolvedValue(mockAllergens);
    SQLite.getIngredientsUnhealthy.mockResolvedValue(mockUnhealthy);
    
    // Setup test data with matching ingredients
    const route = {
      params: {
        data: {
          text: ['milk', 'e621', 'salt']
        }
      }
    };
    
    const { getByText } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('allergenIngredients:')).toBeTruthy();
      expect(getByText('milk(Lactate)')).toBeTruthy();
      expect(getByText('unhealthyIngredients:')).toBeTruthy();
      expect(getByText('e621(Îndulcitor)')).toBeTruthy();
    });
  });
  
  test('displays warning when ingredient matches user allergies', async () => {
    // Setup mock database response
    SQLite.getIngredientsAllergens.mockResolvedValue(mockAllergens);
    
    // Setup test data with matching allergen that user is allergic to
    const route = {
      params: {
        data: {
          text: ['gluten', 'salt']
        }
      }
    };
    
    const { getByText } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('youAre allergicTo:')).toBeTruthy();
      expect(getByText('gluten(Gluten)')).toBeTruthy();
    });
  });
  
  test('opens modal with ingredient details when info button is clicked', async () => {
    // Setup mock database response
    SQLite.getIngredientsAllergens.mockResolvedValue(mockAllergens);
    
    // Setup test data with matching ingredient
    const route = {
      params: {
        data: {
          text: ['gluten', 'salt']
        }
      }
    };
    
    const { getByText, getAllByText, getAllByTestId } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('gluten(Gluten)')).toBeTruthy();
    });
    
    // Find and press the info button (which has an Ionicon)
    const addButtons = getAllByTestId('add-circle-outline');
    fireEvent.press(addButtons[0]);
    
    // Modal should be visible with ingredient details
    await waitFor(() => {
      expect(getByText('name:')).toBeTruthy();
      expect(getByText('gluten')).toBeTruthy();
      expect(getByText('group:')).toBeTruthy();
      expect(getByText('Gluten')).toBeTruthy();
      expect(getByText('description:')).toBeTruthy();
      expect(getByText('Common allergen')).toBeTruthy();
    });
    
    // Close modal
    fireEvent.press(getByText('close'));
    
    // Modal should be closed (this is harder to test directly, but we can verify
    // the modal closing function was called)
  });
  
  test('handles case sensitivity correctly when matching ingredients', async () => {
    // Setup mock database responses
    SQLite.getIngredientsAllergens.mockResolvedValue([
      { id: 1, name: 'GLUTEN', group: 'Gluten', description: 'Case insensitive test' },
    ]);
    
    // Setup test data with different case
    const route = {
      params: {
        data: {
          text: ['gluten', 'salt'] // lowercase, should still match
        }
      }
    };
    
    const { getByText } = render(<IngredientsCheck route={route} />);
    
    await waitFor(() => {
      expect(getByText('GLUTEN(Gluten)')).toBeTruthy();
    });
  });
});