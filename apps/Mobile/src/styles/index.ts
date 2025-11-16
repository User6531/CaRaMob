// Export all theme-related files
export { darkTheme, cssVariables, theme } from "./theme";
export { globalStyles } from "./globalStyles";
export {
  useTheme,
  getColorWithOpacity,
  createThemedStyles,
} from "../hooks/useTheme";

// Re-export commonly used theme values for convenience
export const colors = theme.colors;
export const spacing = theme.spacing;
export const borderRadius = theme.borderRadius;
export const fontSize = theme.fontSize;
export const fontWeight = theme.fontWeight;
export const shadows = theme.shadows;
