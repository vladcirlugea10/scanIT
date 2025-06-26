import AccountInformation from "@/app/(tabs)/AccountInformation";
import { useTheme } from "@/app/ColorThemeContext";
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/components/ToastSuccess', () => ({
  toastSuccess: jest.fn(),
}));

jest.mock('@/utils/date', () => ({
  formatDateToString: jest.fn(date => '01-01-2023'),
  calculateDays: jest.fn(() => 100),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

describe('Account Information Screen', () => {
    beforeEach(() => {
        mockNavigate.mockClear();

        useTheme.mockReturnValue({
                colors: {
                primary: '#123456',
                secondary: '#654321',
                third: '#789012',
                danger: '#ff0000',
            },
            theme: 'light',
        });

        useAuth.mockReturnValue({
            isAuth: true,
            user: {
                firstName: 'John',
                lastName: 'Doe',
                userName: 'johndoe',
                email: 'john@example.com',
                birthday: '01-01-1990',
                height: 180,
                weight: 80,
                gender: 'Male',
                createdAt: '2023-01-01',
                scannedProducts: [
                { name: 'Product1', brand: 'Brand1', nutriscore: 'a', image: 'https://example.com/image1.jpg' }
                ],
            },
            token: 'mock-token',
        });
        useUser.mockReturnValue({
            getUserData: jest.fn(),
            editUser: jest.fn().mockResolvedValue({}),
            error: null,
            loading: false,
            });
        });

        test('renders correctly with user data', () => {
            const { getByText, getByDisplayValue, getByTestId } = render(<AccountInformation />);
            
            expect(getByText('accountInformation')).toBeTruthy();
            expect(getByText('name:')).toBeTruthy();
            expect(getByText('username:')).toBeTruthy();
            expect(getByText('memberSince:')).toBeTruthy();
            expect(getByText('lastScannedProducts:')).toBeTruthy();
            
            expect(getByDisplayValue('John')).toBeTruthy();
            expect(getByDisplayValue('johndoe')).toBeTruthy();
            expect(getByDisplayValue('john@example.com')).toBeTruthy();
        });

        test('redirects to auth when not authenticated', () => {
            useAuth.mockReturnValue({
                isAuth: false,
                user: null,
                token: null,
            });

            render(<AccountInformation />);
            expect(mockNavigate).toHaveBeenCalledWith('Auth');
        });

        test('toggles edit mode', () => {
            const { getByTestId } = render(<AccountInformation />);

            fireEvent.press(getByTestId('edit-button'));
            expect(getByTestId('cancel-edit-button')).toBeTruthy();
        });

        test('saves edited user data', async () => {
            const editUserMock = jest.fn().mockResolvedValue({});
            useUser.mockReturnValue({
                getUserData: jest.fn(),
                editUser: editUserMock,
                error: null,
                loading: false,
            });

            const { getByTestId, getByPlaceholderText } = render(<AccountInformation />);
            fireEvent.press(getByTestId('edit-button'));
            fireEvent.changeText(getByTestId('first-name-input'), 'Jane');
            fireEvent.press(getByTestId('edit-button'));

            await waitFor(() => {
                expect(editUserMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        firstName: 'Jane',
                    })
                );
            });
        });

        test('cancels edit mode', () => {
            const { getByTestId, getByDisplayValue } = render(<AccountInformation />);

            fireEvent.press(getByTestId('edit-button'));
            fireEvent.changeText(getByDisplayValue('John'), 'Jane');
            fireEvent.press(getByTestId('cancel-edit-button'));

            expect(getByDisplayValue('John')).toBeTruthy();
        });
});