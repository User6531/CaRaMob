import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  pageSubtitle: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 18,
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 14,
  },
  sectionTitle: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  field: {
    gap: 6,
  },
  label: {
    color: "#8E8E93",
    fontSize: 13,
  },
  input: {
    backgroundColor: "#232527",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputReadOnly: {
    color: "#B0B0B0",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  hint: {
    color: "#8E8E93",
    fontSize: 12,
    lineHeight: 17,
  },
  actionsSection: {
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.accent.dark,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(74, 222, 158, 0.15)",
  },
  cancelButtonText: {
    color: theme.colors.accent.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  retryButton: {
    marginTop: 8,
  },
});
