import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import UserCheckScreen from "../screens/UserCheckScreen/UserCheckScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen/ProfileEditScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen/ProfileSetupScreen";
import CarCardScreen from "../screens/CarCardScreen/CarCardScreen";
import CarEditScreen from "../screens/CarEditScreen/CarEditScreen";
import ServiceHistoryScreen from "../screens/ServiceHistoryScreen/ServiceHistoryScreen";
import ServiceHistoryCreateScreen from "../screens/ServiceHistoryCreateScreen/ServiceHistoryCreateScreen";
import ServiceHistoryEditScreen from "../screens/ServiceHistoryEditScreen/ServiceHistoryEditScreen";
import ServiceShopDetailScreen from "../screens/ServiceShopDetailScreen/ServiceShopDetailScreen";
import NotificationsScreen from "../screens/NotificationsScreen/NotificationsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Dark theme header styles
const darkHeaderOptions = {
  headerStyle: {
    backgroundColor: theme.colors.background.secondary,
  },
  headerTitleStyle: {
    fontWeight: "600" as const,
    color: theme.colors.text.primary,
  },
  headerTintColor: theme.colors.accent.primary,
  headerBackTitle: "Назад",
};

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
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                ...darkHeaderOptions,
                title: "Профіль",
              }}
            />
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEditScreen}
              options={{
                ...darkHeaderOptions,
                title: "Редагування профілю",
              }}
            />
            <Stack.Screen
              name="ProfileSetup"
              component={ProfileSetupScreen}
              options={{
                ...darkHeaderOptions,
                title: "Налаштування профілю",
              }}
            />
            <Stack.Screen
              name="CarCard"
              component={CarCardScreen}
              options={{
                ...darkHeaderOptions,
                title: "Додати автомобіль",
              }}
            />
            <Stack.Screen
              name="CarEdit"
              component={CarEditScreen}
              options={{
                ...darkHeaderOptions,
                title: "Редагувати автомобіль",
              }}
            />
            <Stack.Screen
              name="ServiceHistory"
              component={ServiceHistoryScreen}
              options={{
                ...darkHeaderOptions,
                title: "Історія обслуговування",
              }}
            />
            <Stack.Screen
              name="ServiceHistoryCreate"
              component={ServiceHistoryCreateScreen}
              options={{
                ...darkHeaderOptions,
                title: "Додати обслуговування",
              }}
            />
            <Stack.Screen
              name="ServiceHistoryEdit"
              component={ServiceHistoryEditScreen}
              options={{
                ...darkHeaderOptions,
                title: "Редагування запису",
              }}
            />
            <Stack.Screen
              name="ServiceShopDetail"
              component={ServiceShopDetailScreen}
              options={{
                ...darkHeaderOptions,
                title: "Автосервіс",
              }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                ...darkHeaderOptions,
                title: "Сповіщення",
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
