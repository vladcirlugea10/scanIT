import PersonalInformation from "@/app/(tabs)/PersonalInformation";
import { useTheme } from "@/app/ColorThemeContext";
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

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

jest.mock('@/components/SelectBox', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return ({ selectedOption, setSelectedOption, options, testID, title }) => {
        return (
            <TouchableOpacity 
                testID={testID}
                onPress={() => {
                    // Simulate selecting the first option when pressed
                    if (options && options.length > 0) {
                        setSelectedOption(options[0]);
                    }
                }}
            >
                <Text>{selectedOption || title}</Text>
            </TouchableOpacity>
        );
    };
});

jest.mock('@/types/AllergenIngredient', () => ({
    AllergenGroups: ['Peanuts', 'Shellfish', 'Dairy', 'Eggs']
}));

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
  formatDateToString: jest.fn(() => '01-01-2023'),
  calculateAge: jest.fn(() => 30),
  calculateDays: jest.fn(() => 100)
}));

jest.mock('@/utils/calloriesCalculator', () => ({
  calculateCalories: jest.fn(() => 2000),
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Ionicons: 'Ionicons',
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Personal Information Screen', () => {
    beforeEach(() => {
        mockNavigate.mockClear();

        useTheme.mockReturnValue({
            colors: {
                primary: '#123456',
                secondary: '#654321',
                third: '#789012',
                danger: '#ff0000',
                success: '#00ff00',
                warning: '#ffff00',
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
                birthday: '01-01-2023',
                height: 180,
                weight: 80,
                gender: 'Male',
                allergies: ['Gluten', 'Lactose'],
            },
            token: 'mock-token',
        });

        useUser.mockReturnValue({
            getUserData: jest.fn(),
            editUser: jest.fn().mockResolvedValue({}),
            addAllergy: jest.fn().mockResolvedValue({}),
            removeAllergy: jest.fn().mockResolvedValue({}),
            error: null,
            loading: false,
        });
    });

    test('renders correctly with user data', () => {
        const { getByText, getByDisplayValue } = render(<PersonalInformation />);

        expect(getByText('personalInformation')).toBeTruthy();
        expect(getByText('name:')).toBeTruthy();
        expect(getByText('birthday:')).toBeTruthy();
        expect(getByText('allergies:')).toBeTruthy();
        expect(getByText('height(cm):')).toBeTruthy();
        expect(getByText('weight(kg):')).toBeTruthy();
        expect(getByText('youAre:')).toBeTruthy();

        expect(getByDisplayValue('John')).toBeTruthy();
        expect(getByDisplayValue('01-01-2023')).toBeTruthy();
        expect(getByDisplayValue('180')).toBeTruthy();
        expect(getByDisplayValue('80')).toBeTruthy();
        expect(getByDisplayValue('Male')).toBeTruthy();

        expect(getByText('Gluten')).toBeTruthy();
        expect(getByText('Lactose')).toBeTruthy();

        expect(getByText(/yourAverageDailyCaloriesIntake/)).toBeTruthy();
        expect(getByText('2000')).toBeTruthy();
    });

    test('redirects to auth when not authenticated', () => {
        useAuth.mockReturnValue({
            isAuth: false,
            user: null,
            token: null,
        });

        render(<PersonalInformation />);
        expect(mockNavigate).toHaveBeenCalledWith('Auth');
    });

    test('toggles edit mode when edit button is pressed', () => {
        const { getByTestId } = render(<PersonalInformation />);
        
        fireEvent.press(getByTestId('edit-button'));
        expect(getByTestId('cancel-edit-button')).toBeTruthy();
    });

    test('saves user data when submitting in edit mode', async () => {
        const editUserMock = jest.fn().mockResolvedValue({});
        useUser.mockReturnValue({
            getUserData: jest.fn(),
            editUser: editUserMock,
            addAllergy: jest.fn(),
            removeAllergy: jest.fn(),
            error: null,
            loading: false,
        });
        
        const { getByTestId } = render(<PersonalInformation />);
        
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

    test('cancels edit when cancel button is pressed', () => {
        const { getByTestId, getByDisplayValue } = render(<PersonalInformation />);
        
        
        fireEvent.press(getByTestId('edit-button'));
        fireEvent.changeText(getByDisplayValue('John'), 'Jane');
        fireEvent.press(getByTestId('cancel-edit-button'));
        
        expect(getByDisplayValue('John')).toBeTruthy();
    });

    test('shows alert when there is an error', () => {
        useUser.mockReturnValue({
        getUserData: jest.fn(),
        editUser: jest.fn(),
        addAllergy: jest.fn(),
        removeAllergy: jest.fn(),
        error: 'Some error occurred',
        loading: false,
        });
        
        render(<PersonalInformation />);
        
        expect(Alert.alert).toHaveBeenCalledWith(
        'error!',
        'Some error occurred',
        expect.any(Array),
        expect.any(Object)
        );
    });

    test('adds an allergy', async () => {
        const addAllergyMock = jest.fn().mockResolvedValue({});
        useUser.mockReturnValue({
            getUserData: jest.fn(),
            editUser: jest.fn(),
            addAllergy: addAllergyMock,
            removeAllergy: jest.fn(),
            error: null,
            loading: false,
        });
        
        const { getByTestId } = render(<PersonalInformation />);
        
        const toggleButton = getByTestId('toggle-allergy-select');
        fireEvent.press(toggleButton);

        await waitFor(() => {
            expect(getByTestId('select-allergy')).toBeTruthy();
        });
        
        const selectBox = getByTestId('select-allergy');
        fireEvent.press(selectBox);
      
        const confirmButton = getByTestId('confirm-allergy-button');
        fireEvent.press(confirmButton);
        
        await waitFor(() => {
            expect(addAllergyMock).toHaveBeenCalledWith('Peanuts');
        }, { timeout: 3000 });
    });
})