// Alternative color palettes for quick theme switching
// To use a different palette, replace the values in theme.ts with one of these

export const blueTheme = {
  background: {
    primary: '#0A0E27',      // Darker blue background
    secondary: '#1A1F3A',    // Card backgrounds
    tertiary: '#2A2F4A',     // Elevated surfaces
    quaternary: '#3A3F5A',   // Borders and dividers
  },
  text: {
    primary: '#E8F4FD',      // Light blue text
    secondary: '#9BB5C7',    // Secondary text
    tertiary: '#7A8B9A',     // Muted text
    inverse: '#0A0E27',      // Text on light backgrounds
  },
  accent: {
    primary: '#4A9EFF',      // Bright blue
    secondary: '#6B73FF',    // Purple-blue
    success: '#4CAF50',      // Green
    warning: '#FF9800',      // Orange
    error: '#F44336',        // Red
    info: '#2196F3',         // Info blue
  },
  // ... other colors would follow the same pattern
};

export const greenTheme = {
  background: {
    primary: '#0D1B0D',      // Dark green background
    secondary: '#1A2B1A',    // Card backgrounds
    tertiary: '#2A3B2A',     // Elevated surfaces
    quaternary: '#3A4B3A',   // Borders and dividers
  },
  text: {
    primary: '#E8F5E8',      // Light green text
    secondary: '#9BB59B',    // Secondary text
    tertiary: '#7A8B7A',     // Muted text
    inverse: '#0D1B0D',      // Text on light backgrounds
  },
  accent: {
    primary: '#4CAF50',      // Green
    secondary: '#8BC34A',    // Light green
    success: '#4CAF50',      // Green
    warning: '#FF9800',      // Orange
    error: '#F44336',        // Red
    info: '#2196F3',         // Info blue
  },
  // ... other colors would follow the same pattern
};

export const purpleTheme = {
  background: {
    primary: '#1A0D1A',      // Dark purple background
    secondary: '#2A1A2A',    // Card backgrounds
    tertiary: '#3A2A3A',     // Elevated surfaces
    quaternary: '#4A3A4A',   // Borders and dividers
  },
  text: {
    primary: '#F5E8F5',      // Light purple text
    secondary: '#B59BB5',    // Secondary text
    tertiary: '#8B7A8B',     // Muted text
    inverse: '#1A0D1A',      // Text on light backgrounds
  },
  accent: {
    primary: '#9C27B0',      // Purple
    secondary: '#E91E63',    // Pink
    success: '#4CAF50',      // Green
    warning: '#FF9800',      // Orange
    error: '#F44336',        // Red
    info: '#2196F3',         // Info blue
  },
  // ... other colors would follow the same pattern
};

// Instructions for switching themes:
/*
To switch to a different theme:

1. Open src/styles/theme.ts
2. Replace the darkTheme object with one of the themes above
3. Update the cssVariables object to match the new theme
4. All components will automatically use the new colors

Example:
export const darkTheme = blueTheme; // or greenTheme, purpleTheme, etc.
*/
