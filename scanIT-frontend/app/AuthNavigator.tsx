import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import { AuthStackParams } from '@/types/StackParamsList';
import ResetPassword from './auth/ResetPassword';

const AuthStack = createNativeStackNavigator<AuthStackParams>();

export default function AuthNavigator() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name='Login' component={Login} options={{headerShown: false}} />
            <AuthStack.Screen name='Register' component={Register} options={{headerShown: false}} />
            <AuthStack.Screen name='ForgotPassword' component={ForgotPassword} options={{headerShown: false}} />
            <AuthStack.Screen name='ResetPassword' component={ResetPassword} options={{headerShown: false}} />
        </AuthStack.Navigator>
    )
}