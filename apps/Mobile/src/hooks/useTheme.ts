import { theme } from "../styles/theme";

// Hook for accessing theme values
export const useTheme = () => {
  return {
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    shadows: theme.shadows,
  };
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper function to create dynamic styles
export const createThemedStyles = (
  styleCreator: (theme: typeof theme) => any
) => {
  return styleCreator(theme);
};
