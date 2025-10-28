import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import UserCheckScreen from '../screens/UserCheckScreen/UserCheckScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen/ProfileEditScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen/ProfileSetupScreen';
import CarCardScreen from '../screens/CarCardScreen/CarCardScreen';
import CarEditScreen from '../screens/CarEditScreen/CarEditScreen';
import CarDetailsScreen from '../screens/CarDetailsScreen/CarDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // можна зробити splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="UserCheck" 
              component={UserCheckScreen} 
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }} 
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }} 
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen 
              name="ProfileEdit" 
              component={ProfileEditScreen} 
              options={{ 
                headerShown: true,
                title: 'Редагування профілю',
                headerBackTitle: 'Назад',
                headerStyle: {
                  backgroundColor: '#f8f9fa',
                },
                headerTitleStyle: {
                  fontWeight: '600',
                  color: '#333',
                },
                headerTintColor: '#007AFF',
              }} 
            />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ headerShown: false }} />
            <Stack.Screen 
              name="CarCard" 
              component={CarCardScreen} 
              options={{ 
                headerShown: true,
                title: 'Додати автомобіль',
                headerBackTitle: 'Назад',
                headerStyle: {
                  backgroundColor: '#f8f9fa',
                },
                headerTitleStyle: {
                  fontWeight: '600',
                  color: '#333',
                },
                headerTintColor: '#007AFF',
              }} 
            />
            <Stack.Screen 
              name="CarEdit" 
              component={CarEditScreen} 
              options={{ 
                headerShown: true,
                title: 'Редагувати автомобіль',
                headerBackTitle: 'Назад',
                headerStyle: {
                  backgroundColor: '#f8f9fa',
                },
                headerTitleStyle: {
                  fontWeight: '600',
                  color: '#333',
                },
                headerTintColor: '#007AFF',
              }} 
            />
            <Stack.Screen 
              name="CarDetails" 
              component={CarDetailsScreen} 
              options={{ 
                headerShown: true,
                title: 'Деталі автомобіля',
                headerBackTitle: 'Назад',
                headerStyle: {
                  backgroundColor: '#f8f9fa',
                },
                headerTitleStyle: {
                  fontWeight: '600',
                  color: '#333',
                },
                headerTintColor: '#007AFF',
              }} 
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}