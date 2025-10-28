import { StyleSheet, StatusBar } from 'react-native';
import { theme } from './theme';

// Global styles using the theme
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // Page background - separate variable for page backgrounds
  pageBackground: {
    backgroundColor: theme.colors.background.primary,
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  
  cardElevated: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.large,
  },
  
  // Text styles
  textPrimary: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
  },
  
  textSecondary: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.md,
  },
  
  textTertiary: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSize.sm,
  },
  
  textLarge: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  
  textSmall: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
  },
  
  // Button styles
  buttonPrimary: {
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimaryText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.interactive.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  
  buttonSecondaryText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  
  buttonDanger: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.interactive.danger,
  },
  
  buttonDangerText: {
    color: theme.colors.interactive.danger,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  
  // Input styles
  input: {
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
  },
  
  inputFocused: {
    borderColor: theme.colors.border.focus,
  },
  
  // Divider styles
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.secondary,
    marginVertical: theme.spacing.md,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.md,
  },
  
  // Error styles
  errorText: {
    color: theme.colors.accent.error,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
  
  // Status styles
  statusSuccess: {
    color: theme.colors.accent.success,
  },
  
  statusWarning: {
    color: theme.colors.accent.warning,
  },
  
  statusError: {
    color: theme.colors.accent.error,
  },
  
  statusInfo: {
    color: theme.colors.accent.info,
  },
  
  // Spacing utilities
  marginXs: { margin: theme.spacing.xs },
  marginSm: { margin: theme.spacing.sm },
  marginMd: { margin: theme.spacing.md },
  marginLg: { margin: theme.spacing.lg },
  marginXl: { margin: theme.spacing.xl },
  
  paddingXs: { padding: theme.spacing.xs },
  paddingSm: { padding: theme.spacing.sm },
  paddingMd: { padding: theme.spacing.md },
  paddingLg: { padding: theme.spacing.lg },
  paddingXl: { padding: theme.spacing.xl },
  
  // Flex utilities
  row: {
    flexDirection: 'row',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Border radius utilities
  borderRadiusSm: { borderRadius: theme.borderRadius.sm },
  borderRadiusMd: { borderRadius: theme.borderRadius.md },
  borderRadiusLg: { borderRadius: theme.borderRadius.lg },
  borderRadiusXl: { borderRadius: theme.borderRadius.xl },
  borderRadiusXxl: { borderRadius: theme.borderRadius.xxl },
});

// StatusBar configuration for dark theme
export const configureStatusBar = () => {
  StatusBar.setBarStyle('light-content', true);
  StatusBar.setBackgroundColor(theme.colors.background.primary, true);
};
