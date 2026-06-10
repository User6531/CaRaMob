// Dark Theme Color Palette
export const darkTheme = {
  // Background colors
  background: {
    primary: "#121212", // Main background (deep black)
    secondary: "#121212", // Card backgrounds
    tertiary: "#1A1C1E", // Elevated surfaces (graphite)
    quaternary: "#1F2123", // Borders and dividers
  },

  // Text colors
  text: {
    primary: "#FFFFFF", // Main text (white)
    secondary: "#B0B0B0", // Secondary text (soft gray)
    tertiary: "#808080", // Muted text
    inverse: "#121212", // Text on light backgrounds
  },

  // Accent colors
  accent: {
    primary: "#4ade9e", // Main brand green
    secondary: "#3bc98e", // Hover / pressed green
    dark: "#1a4038", // Dark green surfaces
    success: "#4ade9e",
    warning: "#D29922", // Orange
    error: "#F85149", // Red
    info: "#4ade9e",
  },

  // Interactive elements
  interactive: {
    primary: "#4ade9e", // Primary button
    primaryHover: "#3bc98e",
    secondary: "#1A1C1E", // Secondary button
    secondaryHover: "#232527", // Secondary button hover
    danger: "#DA3633", // Danger button
    dangerHover: "#F85149", // Danger button hover
  },

  // Borders and shadows
  border: {
    primary: "#232527", // Main borders
    secondary: "#1A1C1E", // Subtle borders
    focus: "#4ade9e",
  },

  // Shadows
  shadow: {
    small: "rgba(0, 0, 0, 0.3)",
    medium: "rgba(0, 0, 0, 0.4)",
    large: "rgba(0, 0, 0, 0.5)",
  },

  // Status colors
  status: {
    online: "#4ade9e",
    offline: "#6E7681",
    away: "#D29922",
    busy: "#F85149",
  },

  // Special colors
  special: {
    placeholder: "#6E7681",
    disabled: "#484F58",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
};

// CSS Variables for easy theme switching
export const cssVariables = {
  // Background variables
  "--bg-primary": darkTheme.background.primary,
  "--bg-secondary": darkTheme.background.secondary,
  "--bg-tertiary": darkTheme.background.tertiary,
  "--bg-quaternary": darkTheme.background.quaternary,

  // Text variables
  "--text-primary": darkTheme.text.primary,
  "--text-secondary": darkTheme.text.secondary,
  "--text-tertiary": darkTheme.text.tertiary,
  "--text-inverse": darkTheme.text.inverse,

  // Accent variables
  "--accent-primary": darkTheme.accent.primary,
  "--accent-secondary": darkTheme.accent.secondary,
  "--accent-success": darkTheme.accent.success,
  "--accent-warning": darkTheme.accent.warning,
  "--accent-error": darkTheme.accent.error,
  "--accent-info": darkTheme.accent.info,

  // Interactive variables
  "--interactive-primary": darkTheme.interactive.primary,
  "--interactive-primary-hover": darkTheme.interactive.primaryHover,
  "--interactive-secondary": darkTheme.interactive.secondary,
  "--interactive-secondary-hover": darkTheme.interactive.secondaryHover,
  "--interactive-danger": darkTheme.interactive.danger,
  "--interactive-danger-hover": darkTheme.interactive.dangerHover,

  // Border variables
  "--border-primary": darkTheme.border.primary,
  "--border-secondary": darkTheme.border.secondary,
  "--border-focus": darkTheme.border.focus,

  // Shadow variables
  "--shadow-small": darkTheme.shadow.small,
  "--shadow-medium": darkTheme.shadow.medium,
  "--shadow-large": darkTheme.shadow.large,

  // Status variables
  "--status-online": darkTheme.status.online,
  "--status-offline": darkTheme.status.offline,
  "--status-away": darkTheme.status.away,
  "--status-busy": darkTheme.status.busy,

  // Special variables
  "--special-placeholder": darkTheme.special.placeholder,
  "--special-disabled": darkTheme.special.disabled,
  "--special-overlay": darkTheme.special.overlay,
};

// React Native StyleSheet compatible theme
export const theme = {
  colors: darkTheme,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  shadows: {
    small: {
      shadowColor: darkTheme.shadow.small,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: darkTheme.shadow.medium,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: darkTheme.shadow.large,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
