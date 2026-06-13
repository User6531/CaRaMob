if (__DEV__) {
  require("./src/config/ReactotronConfig");
}

import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CarProvider } from './src/context/CarContext';
import AppNavigator from './src/navigation/AppNavigator';
import { queryClient } from './src/lib/queryClient';
import { configureStatusBar } from './src/styles/globalStyles';

export default function App() {
  useEffect(() => {
    configureStatusBar();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CarProvider>
              <StatusBar style="light" backgroundColor="#0D1117" />
              <AppNavigator />
            </CarProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}