import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from './useTheme';

// Hook for consistent StatusBar configuration
export const useStatusBar = () => {
  const theme = useTheme();
  
  return (
    <StatusBar 
      style="light" 
      backgroundColor={theme.colors.background.primary} 
    />
  );
};
