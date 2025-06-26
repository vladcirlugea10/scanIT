import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useAuth } from '@/hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import Profile from '@/app/(tabs)/Profile';

const mockOnLogout = jest.fn();
const mockNavigate = jest.fn();
const mockToggleTheme = jest.fn();
const mockToastSuccess = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    onLogout: mockOnLogout,
  }),
}));

jest.mock('@/app/ColorThemeContext', () => ({
  useTheme: () => ({
    colors: {
      secondary: '#fff',
      danger: 'red',
    },
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}));

jest.mock('@/components/ToastSuccess', () => ({
  __esModule: true,
  default: mockToastSuccess,
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

jest.spyOn(Alert, 'alert');

describe('Profile Screen', () => {
  it('should render all profile cards', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Profile />
      </NavigationContainer>
    );

    expect(getByText('personalInfo')).toBeTruthy();
    expect(getByText('accountInfo')).toBeTruthy();
    expect(getByText('addedProducts')).toBeTruthy();
    expect(getByText('editedProducts')).toBeTruthy();
    expect(getByText('darkMode')).toBeTruthy();
    expect(getByText('languageAndLocation')).toBeTruthy();
    expect(getByText('termsOfUse')).toBeTruthy();
    expect(getByText('logout')).toBeTruthy();
  });

    it('should navigate to Personal Information on card press', () => {
        const { getByText } = render(
        <NavigationContainer>
            <Profile />
        </NavigationContainer>
        );
    
        fireEvent.press(getByText('personalInfo'));
        expect(mockNavigate).toHaveBeenCalledWith('PersonalInformation');
    });

    it('should navigate to Account Information on card press', () => {
        const { getByText } = render(
        <NavigationContainer>
            <Profile />
        </NavigationContainer>
        );
    
        fireEvent.press(getByText('accountInfo'));
        expect(mockNavigate).toHaveBeenCalledWith('AccountInformation');
    });

    it('should navigate to Added Products on card press', () => {
        const { getByText } = render(
        <NavigationContainer>
            <Profile />
        </NavigationContainer>
        );
    
        fireEvent.press(getByText('addedProducts'));
        expect(mockNavigate).toHaveBeenCalledWith('AddedProducts');
    }
    );

    it('should navigate to Edited Products on card press', () => {
        const { getByText } = render(
        <NavigationContainer>
            <Profile />
        </NavigationContainer>
        );
    
        fireEvent.press(getByText('editedProducts'));
        expect(mockNavigate).toHaveBeenCalledWith('EditedProducts');
    }
    );

    it('should navigate to Change Language on card press', () => {
        const { getByText } = render(
        <NavigationContainer>
            <Profile />
        </NavigationContainer>
        );
    
        fireEvent.press(getByText('languageAndLocation'));
        expect(mockNavigate).toHaveBeenCalledWith('ChangeLanguage');
    }
    );

  it('should call toggleTheme and show toast on theme change', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Profile />
      </NavigationContainer>
    );

    fireEvent.press(getByText('darkMode'));

    expect(mockToggleTheme).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith('colorSchemeChanged');
  });

  it('should show alert when pressing logout', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Profile />
      </NavigationContainer>
    );

    fireEvent.press(getByText('logout'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'logout',
      'areYouSureLogout',
      [
        { text: 'cancel', style: 'cancel' },
        { text: 'yes', onPress: expect.any(Function) }
      ],
      { cancelable: false }
    );
  });

  it('should navigate to Home after logout confirmation', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Profile />
      </NavigationContainer>
    );

    fireEvent.press(getByText('logout'));

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0][2];
    const yesButton = alertCall.find((btn: any) => btn.text === 'yes');
    await yesButton.onPress();

    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
