import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { CarProvider } from './src/context/CarContext';
import AppNavigator from './src/navigation/AppNavigator';
import { queryClient } from './src/lib/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CarProvider>
          <AppNavigator />
        </CarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}