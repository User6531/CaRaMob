import { AuthProvider } from './src/context/AuthContext';
import { CarProvider } from './src/context/CarContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <AppNavigator />
      </CarProvider>
    </AuthProvider>
  );
}